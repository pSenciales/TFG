"use client";

import React, { useRef, useEffect} from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Report, ReportsResponse } from "@/types/reports";
import FadeIn from "@/components/fadeIn";
import { ThreeDot } from "react-loading-indicators";
import { useMyReports } from "@/hooks/useMyReports";

import SortAndFilterButton from "@/components/my-reports/SortAndFilterButton";
import ReportCard from "@/components/my-reports/ReportCard";


// Función de fetch para useInfiniteQuery


export default function MyReports() {

  const {
    toggleCheckbox,
    applyFilters,
    openPDF,
    deleteReport,
    appliedFilters,
    isHateCheckBox,
    setIsHateCheckBox,
    notHateCheckBox,
    setNotHateCheckBox,
    processingCheckBox,
    setProcessingCheckBox,
    acceptedCheckBox,
    setAcceptedCheckBox,
    rejectedCheckBox,
    setRejectedCheckBox,
    sortBy,
    setSortBy,
    filtersCount,
    fetchReports,
    session,
    status
    
  } = useMyReports();

  /*
  async function fetchReports({
    pageParam = 0
  }: {
    pageParam?: number;
  }) {

    // Dentro de fetchReports o donde montes la URL:
    const email = session?.user?.email ?? "";
    const provider = session?.provider ?? "";
    const cursor = 0;      // o el valor que saques de pageParam
    const limit = 9;      // si quieres hacerlo configurable, añádelo a appliedFilters también

    // Desestructuramos los filtros aplicados
    const {
      sortBy,
      includeHate,
      includeNotHate,
      statuses
    } = appliedFilters;

    // Montamos los params
    const params = new URLSearchParams({
      email,
      provider,
      cursor: String(cursor),
      limit: String(limit),
      sortBy
    });
    

    // Hate / not-hate
    params.set("includeHate", includeHate.toString());
    params.set("includeNotHate", includeNotHate.toString());

    // Estados: uno por entrada
    statuses.forEach((s) => params.append("status", s));

    // URL final
    const url = `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/user?${params.toString()}`;

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
  }*/

  type Filters = {
    email: string;
    provider: string;
    filterEmail: string;
    sortBy: string;
    includeHate: boolean;
    includeNotHate: boolean;
    statuses: string[];
  };

  type ReportsQueryKey = ["reports", Filters];

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
    ReportsQueryKey, // TQueryKey
    number           // TPageParam: el tipo de pageParam
  >({
    queryKey: [
      "reports",
      {
        email: session?.user.email,
        provider: session?.provider,
        filterEmail: appliedFilters.filterEmail,
        sortBy: appliedFilters.sortBy,
        includeHate: appliedFilters.includeHate,
        includeNotHate: appliedFilters.includeNotHate,
        statuses: appliedFilters.statuses,
      },
    ] as ReportsQueryKey,
    enabled: status === "authenticated",
    queryFn: ({ pageParam = 0 }) => fetchReports({ pageParam, isAdmin: false }),
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

  if (status === "loading" || isLoading) {
    return <FadeIn><div className="mt-20"><p style={{ textAlign: "center" }} className="text-black">

      Loading reports <ThreeDot color="#000000" size="small" />
    </p></div> </FadeIn>;
  }
  if (!session || session.role != "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  if (isError) {
    return <div>Error loading reports</div>;
  }

  // @ts-expect-error typescript no typea correctamente data
  const allReports = data?.pages?.flatMap((page: ReportsResponse) => page.reports) ?? [];

 

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
      <FadeIn duration={0.5}>
        <h1 className="text-center text-3xl font-bold mt-10">My Reports</h1>
      </FadeIn>
      {/* ─── FILTER CONTROLS ──────────────────────────────────────────── */}
      {/* ─── SEARCH + FILTER ROW ─────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
          {/* Sort & Filter button */}
          <SortAndFilterButton
             sortBy={sortBy}
             setSortBy={setSortBy}
             toggleCheckbox={toggleCheckbox}
             isHateCheckBox={isHateCheckBox}
             setIsHateCheckBox={setIsHateCheckBox}
             notHateCheckBox={notHateCheckBox}
             setNotHateCheckBox={setNotHateCheckBox}
             processingCheckBox={processingCheckBox}
             setProcessingCheckBox={setProcessingCheckBox}
             acceptedCheckBox={acceptedCheckBox}
             setAcceptedCheckBox={setAcceptedCheckBox}
             rejectedCheckBox={rejectedCheckBox}
             setRejectedCheckBox={setRejectedCheckBox}
             applyFilters={applyFilters}
             filtersCount={filtersCount}
          />
        </div>
      </div>

      {
        allReports && allReports.length > 0 ? (

            <div className="w-full max-w-7xl mx-auto px-4 space-y-6">


              {/* ─── REPORTS GRID ───────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {allReports.map((report: Report) => (
                  <FadeIn key={report._id.$oid}>
                    <ReportCard
                      report={report}
                      onDelete={() => deleteReport(report._id.$oid)}
                      openPDF={() => openPDF(report)}
                    />
                  </FadeIn>
                ))}
              </div>
            </div>

        ) : (
          <div className="text-center">

            <h1 className="font-bold text-xl w-full">Oops! It looks like you do not have any reports righ now...😅</h1>
            <h1 className="font-bold text-xl w-full">Report <a className="text-blue underline decoration-wavy" href="/report">here</a> now!</h1>
          </div>

        )
      }


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
