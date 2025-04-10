"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useQuery, QueryFunctionContext } from "@tanstack/react-query";
import { ReportsResponse } from "@/types/reports";
import { ReportCard } from "@/components/my-reports/reportCard";
import Swal from "sweetalert2";

// Definimos la key
type MyQueryKey = [string, { email: string; provider?: string; cursor: number }];

// Función de fetch (igual que antes)
async function fetchReports({ queryKey }: QueryFunctionContext<MyQueryKey>) {
  const [_queryName, { email, provider, cursor }] = queryKey;
  const url = `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/user?email=${email}&provider=${provider}&cursor=${cursor}`;
  try {
    const res = await axios.post(
      "/api/proxy",
      { url, method: "get" },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data as ReportsResponse;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.status === 401 &&
      error.response?.data.error === "Session expired or invalid token"
    ) {
      await Swal.fire({
        title: "The session has expired!",
        text: "please log in again",
        icon: "warning",
      }).then(() => {
        signOut();
        window.location.href = "/login";
      });
    } else {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while sending the analysis. Please try again later.",
        icon: "error",
      });
    }
    return {} as ReportsResponse;
  }
}

export default function MyReports() {
  const { data: session, status } = useSession();
  const [cursor, setCursor] = useState(0);

  // Siempre llamamos a useQuery, pero lo "activamos" solo si hay sesión
  const { data, isLoading, error } = useQuery<
    ReportsResponse,
    Error,
    ReportsResponse,
    MyQueryKey
  >({
    queryKey: [
      "reports",
      {
        email: session?.user?.email ?? "",
        provider: session?.provider ?? "",
        cursor,
      },
    ],
    queryFn: fetchReports,
    enabled: status === "authenticated", 
    // Se habilita la query solo si hay sesión y no estamos en loading
  });

  // Ahora hacemos la lógica de UI
  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session) {
    // Redirige a login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Si la query está en loading
  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  // Si hubo algún error en la query (no el error 401 anterior, sino otra cosa)
  if (error) {
    return <div>Error loading reports</div>;
  }

  return (
    <div>
      <h1>My Reports</h1>
      {data?.reports?.map((report) => (
        <div key={report._id}>
          <ReportCard
            content={report.content}
            context={report.context}
            source={report.source}
            url={report.pdf[0]?.url}
            createdAt={new Date(report.created_at.$date).toLocaleString()}
            isHate={report.is_hate}
          />
        </div>
      ))}

      {data?.nextCursor !== null && (
        <button onClick={() => setCursor(data?.nextCursor ?? 0)}>Load More</button>
      )}
    </div>
  );
}
