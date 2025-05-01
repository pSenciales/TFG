import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PieChart, Pie } from "recharts";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Skeleton } from "@/components/ui/skeleton"

import Swal from "sweetalert2";
import { signOut } from "next-auth/react";
import { AxiosError } from "axios";

type Slice = { tag: string; number: number; fill?: string };

type chartConfigElemment = {
    [key: string]: {
        label: string;
        color?: string;
    }
}

interface StatusPieChartProps {
    url: string;
    title: string;
    subtitle: string;
    queryKey: string;
    chartConfigElements: chartConfigElemment;

}



export default function GenericPieChart({ url, title, subtitle, queryKey, chartConfigElements }: StatusPieChartProps) {
    const [days, setDays] = useState("7");

    async function fetchData(): Promise<Slice[]> {
        try {
            const response = await axios.post<Slice[]>("/api/proxy", {
                url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/${url}?days=${days}`,
                method: "get"
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data.map((row: Slice) => {
                row.fill = `var(--color-${row.tag})`;
                return row;
            });

        } catch (error) {
            if (
                error instanceof AxiosError &&
                error.status === 401 &&
                error.response?.data.error === "Session expired or invalid token"
            ) {
                // Sesión expirada
                await Swal.fire({
                    title: "The session has expired!",
                    text: "Please log in again",
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
            return [] as Slice[];
        }
    }

        const { data, isLoading, error, refetch } = useQuery<Slice[], Error>({
            queryKey: [queryKey, days],
            queryFn: () => fetchData(),
        });

        useEffect(() => {
            refetch();
        }, [days, refetch]);

        if (error) return <Card><CardContent>Error: {error.message}</CardContent></Card>;

        const chartConfig = chartConfigElements satisfies ChartConfig

        return (

            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex-wrap max-w-[50%]">
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{subtitle}</CardDescription>
                        </div>
                        <Select value={days} onValueChange={setDays}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Days" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="7">Last 7 days</SelectItem>
                                    <SelectItem value="30">Last 30 days</SelectItem>
                                    <SelectItem value="90">Last 90 days</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pb-0 items-center">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                    >
                        {isLoading ? (
                            <Skeleton className="size-[70%] mx-auto rounded-full" />
                        ) : (
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie data={data} dataKey="number" label nameKey="tag" />
                                <ChartLegend
                                    content={<ChartLegendContent nameKey="tag" />}
                                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                                />
                            </PieChart>
                        )}

                    </ChartContainer>
                </CardContent>
            </Card>
        );
    }
