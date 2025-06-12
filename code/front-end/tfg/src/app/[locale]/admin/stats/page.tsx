"use client"

import ReportsResolutionsChart from "@/components/stats/ReportsResolutionsChart"
import GenericPieChart from "@/components/stats/PieChart"
import { useSession } from "next-auth/react"
import FadeIn from "@/components/fadeIn"
import { ThreeDot } from "react-loading-indicators"

import { useTranslations } from "next-intl"


export default function Stats() {
  const t = useTranslations("admin.stats");
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <FadeIn><div className="mt-20"><p style={{ textAlign: "center" }} className="text-black">

      Loading stats <ThreeDot color="#000000" size="small" />
    </p></div> </FadeIn>;
  }
  if ((!session || session.role != "admin")) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }


  return (

    <div className="flex flex-col">
      <FadeIn duration={0.5}>
        <h1 className="text-center text-3xl font-bold mt-10">{t('title')}</h1>
        <ReportsResolutionsChart />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10 mx-4">
          <GenericPieChart
            url="reports/stats/status"
            title={t('piecharts.status.title')}
            subtitle={t('piecharts.status.subtitle')}
            queryKey="status"
            chartConfigElements={{
              "Number": {
                label: "Number"
              },
              Processing: {
                label: t('piecharts.status.labels.processing'),
                color: "#9AD8D8", // Indigo-400
              },
              Accepted: {
                label: t('piecharts.status.labels.accepted'),
                color: "#37A3A3", // Rose-400
              },
              Rejected: {
                label: t('piecharts.status.labels.rejected'),
                color: "#004D4D", // Emerald-500
              },
            }}
          />
          <GenericPieChart
            url="reports/stats/hate"
            title={t('piecharts.hate.title')}
            subtitle={t('piecharts.hate.subtitle')}
            queryKey="hate"
            chartConfigElements={{
              "Number": {
                label: "Number"
              },
              Hate: {
                label: t('piecharts.hate.labels.true'),
                color: "#CA6C0F",
              },
              Not_Hate: {
                label: t('piecharts.hate.labels.false'),
                color: "#732E00",
              },

            }}
          />
          <GenericPieChart
            url="reports/stats/registered"
            title={t('piecharts.registered.title')}
            subtitle={t('piecharts.registered.subtitle')}
            queryKey="registerd"
            chartConfigElements={{
              "Number": {
                label: "Number"
              },
              Registered: {
                label: t('piecharts.registered.labels.registered'),
                color: "#003366",
              },
              Unregistered: {
                label: t('piecharts.registered.labels.unregistered'),
                color: "#0066CC",
              },

            }}
          />
        </div>
      </FadeIn>
    </div>

  )

}
