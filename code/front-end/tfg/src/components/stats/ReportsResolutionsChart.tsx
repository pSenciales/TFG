import { ReportsResolutionsChartData } from "@/types/charts"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { useState, useEffect } from "react"

import { AxiosError } from "axios"
import Swal from "sweetalert2"
import { signOut } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import axios from "axios"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useTranslations } from "next-intl"

export default function ReportsResolutionsChart() {

  const t = useTranslations("admin.stats");
  const talerts = useTranslations("alerts");

  const [days, setDays] = useState<string>("7");
  async function fetchData(): Promise<ReportsResolutionsChartData[]> {
    try {
      const response = await axios.post<ReportsResolutionsChartData[]>("/api/proxy", {
        url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/stats/reports?days=${days}`,
        method: "get"
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.status === 401 &&
        error.response?.data.error === "Session expired or invalid token"
      ) {
        // Sesión expirada
        await Swal.fire({
          title: talerts("sessionexpired.title"),
          text: talerts("sessionexpired.text"),
          icon: "warning",
        }).then(() => {
          signOut();
          window.location.href = "/login";
        });
      } else {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while fetching data. Please try again later.",
          icon: "error",
        });
      }
      return [] as ReportsResolutionsChartData[];
    }
  }

  const { data, isLoading, error, refetch } = useQuery<ReportsResolutionsChartData[], Error>({
    queryKey: ["reports-resolutions-chart", days],
    queryFn: () => fetchData(),
  });

  useEffect(() => {
    refetch();
  }, [days, refetch]);




  const chartConfig = {
    resolution: {
      label: t('resolutions.labels.resolutions'),
      color: "hsl(var(--chart-4))",
    },
    report: {
      label: t('resolutions.labels.reports'),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  const maxValues = {
    reports: Math.max(...(data ?? []).map(item => item.reports)),
    resolutions: Math.max(...(data ?? []).map(item => item.resolutions))
  };

  const yAxisDataKey = maxValues.reports >= maxValues.resolutions ? "reports" : "resolutions";

  if (error) return <Card><CardContent>Error: {error.message}</CardContent></Card>;


  return (
    <div className="size-[90%] md:size-[80%] xl:size-[60%] mx-auto mt-10">

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('resolutions.title')}</CardTitle>
              <CardDescription>{t('resolutions.subtitle')}</CardDescription>
            </div>
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="7">{t('days.last7')}</SelectItem>
                  <SelectItem value="30">{t('days.last30')}</SelectItem>
                  <SelectItem value="90">{t('days.last90')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            {
              isLoading ? (
                <Skeleton className="size-full mx-auto rounded-xl" />
              ) :
                (
                  <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      dataKey={yAxisDataKey}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip cursor={true} content={<ChartTooltipContent  />} />
                    <Line
                      dataKey="resolutions"
                      type="monotone"
                      stroke="var(--color-resolution)"
                      strokeWidth={2}
                      dot={false}
                      label= {t('resolutions.labels.reports')}
                    />
                    <Line
                      dataKey="reports"
                      type="monotone"
                      stroke="var(--color-report)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                )
            }

          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}