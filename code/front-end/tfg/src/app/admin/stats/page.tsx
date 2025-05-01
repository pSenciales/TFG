"use client"

import ReportsResolutionsChart from "@/components/stats/ReportsResolutionsChart"
import GenericPieChart from "@/components/stats/PieChart"
import { useSession } from "next-auth/react"
import FadeIn from "@/components/fadeIn"
import { ThreeDot } from "react-loading-indicators"


export default function Page() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <FadeIn><div className="mt-20"><p style={{ textAlign: "center" }} className="text-black">

      Loading stats <ThreeDot color="#000000" size="small" />
    </p></div> </FadeIn>;
  }
  if (!session || session.role != "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }


  return (

    <div className="flex flex-col">
      <FadeIn duration={0.5}>
        <h1 className="text-center text-3xl font-bold mt-10">Stats</h1>
        <ReportsResolutionsChart />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10 mx-4">
          <GenericPieChart
            url="reports/stats/status"
            title="Reports Status"
            subtitle="Number of reports by status"
            queryKey="status"
            chartConfigElements={{
              "Number": {
                label: "Number"
              },
              Processing: {
                label: "Processing",
                color: "#9AD8D8", // Indigo-400
              },
              Accepted: {
                label: "Accepted",
                color: "#37A3A3", // Rose-400
              },
              Rejected: {
                label: "Rejected",
                color: "#004D4D", // Emerald-500
              },
            }}
          />
          <GenericPieChart
            url="reports/stats/hate"
            title="Hate Detection"
            subtitle="Number of reports classified as hate speech or not hate speech"
            queryKey="hate"
            chartConfigElements={{
              "Number": {
                label: "Number"
              },
              Hate: {
                label: "Hate",
                color: "#CA6C0F",
              },
              Not_Hate: {
                label: "Not Hate",
                color: "#732E00",
              },

            }}
          />
          <GenericPieChart
            url="reports/stats/registered"
            title="Registered & Unregistered"
            subtitle="Number of reports by registered and unregistered users"
            queryKey="registerd"
            chartConfigElements={{
              "Number": {
                label: "Number"
              },
              Registered: {
                label: "Registered users",
                color: "#003366",
              },
              Unregistered: {
                label: "Unregistered users",
                color: "#0066CC",
              },

            }}
          />
        </div>
      </FadeIn>
    </div>

  )

}
