"use client";

import React, { useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Report, ReportsResponse } from "@/types/reports";
import ReportCard  from "@/components/my-reports/reportCard";
import FadeIn from "@/components/fadeIn";
import { ThreeDot } from "react-loading-indicators";


// Función de fetch para useInfiniteQuery
async function fetchReports({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number;
  // La queryKey es un array: ["reports", { email, provider }]
  queryKey: (string | { email: string; provider: string })[];
}) {
  const [_, params] = queryKey;
  const { email, provider } = params as { email: string; provider: string };
  const cursor = pageParam;

  const url = `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/user?email=${email}&provider=${provider}&cursor=${cursor}`;

  try {
    const res = await axios.post(
      "/api/proxy",
      { url, method: "get" },
      { headers: { "Content-Type": "application/json" } }
    );

    const data = res.data as ReportsResponse;
    return {
      ...data, // { reports: Report[], nextCursor: number|null }
      currentCursor: cursor,
    };
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

    // Retornamos datos vacíos para no romper el tipado
    return {
      reports: [],
      nextCursor: null,
      currentCursor: cursor,
    } as ReportsResponse & { currentCursor: number };
  }
}

export default function MyReports() {
  const { data: session, status } = useSession();

  // useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    ReportsResponse, // TQueryFnData 
    Error,           // TError
    ReportsResponse, // TData (lo mismo si no usas select)
    (string | { email: string; provider: string })[], // TQueryKey
    number           // TPageParam: el tipo de pageParam
  >({
    queryKey: [
      "reports",
      {
        email: session?.user?.email ?? "",
        provider: session?.provider ?? "",
      },
    ],
    enabled: status === "authenticated",
    queryFn: fetchReports,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== null ? lastPage.nextCursor : undefined,
  });

  // Sentinel = observador al final de la lista
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Efecto para scroll infinito
  useEffect(() => {
    if (!hasNextPage) return; // si no hay siguiente página, no observar
    if (!sentinelRef.current) return;

    // Observa cuando el sentinel esté en pantalla
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetchingNextPage) {
        // Llamamos a fetchNextPage cuando aparece en la vista
        fetchNextPage();
      }
    });

    observer.observe(sentinelRef.current);

    // Cleanup cuando se desmonta o cambia la ref
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  if (isLoading) {
    return <div>Loading reports...</div>;
  }
  if (isError) {
    return <div>Error loading reports</div>;
  }

  // @ts-expect-error
  const allReports = data?.pages?.flatMap((page: ReportsResponse) => page.reports) ?? [];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
      <FadeIn duration={0.5}>
      <h1 className="text-center text-3xl font-bold mt-10">My Reports</h1>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto place-items-start">
      {allReports.map((report: Report) => (
        <div key={report._id.$oid} className="w-full mb-2">
        <ReportCard report={report} />
        </div>
      ))}
      </div>

      {hasNextPage && (
      <div
        ref={sentinelRef}
        style={{ height: 1 }}
        aria-label="Sentinel for Infinite Scroll"
      />
      )}

      {isFetchingNextPage && (
      <p style={{ textAlign: "center" }} className="text-black">

                        Loading <ThreeDot color="#000000" size="large" />
      </p>
      )}
    </div>
  );
}
