"use client";

import React, { useRef, useEffect } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Report, ReportsResponse, Filters } from "@/types/reports";
import FadeIn from "@/components/fadeIn";
import { ThreeDot } from "react-loading-indicators";
import { useMyReports } from "@/hooks/useMyReports";

import SortAndFilterButton from "@/components/my-reports/SortAndFilterButton";
import ReportCard from "@/components/my-reports/ReportCard";

import { useTranslations } from "next-intl";

import { Link } from '@/i18n/navigation';
// Función de fetch para useInfiniteQuery


export default function MyReports() {

  const t = useTranslations("myreports");

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
    queryFn: ({ pageParam = 0 }) => fetchReports({ pageParam, urlUser: "user" }),
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

      {t('loading')} <ThreeDot color="#000000" size="small" />
    </p></div> </FadeIn>;
  }
  if (!session || session.role != "admin") {
    if (typeof window !== "undefined") {
      const locale = window.location.pathname.split("/")[1];
      window.location.href = `${locale}/login`;
    }
    return null;
  }
  if (isError) {
    return <div>t('errorloading')</div>;
  }

  // @ts-expect-error typescript no typea correctamente data
  const allReports = data?.pages?.flatMap((page: ReportsResponse) => page.reports) ?? [];



  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
      <FadeIn duration={0.5}>
        <h1 className="text-center text-3xl font-bold mt-10">{t('title')}</h1>
      </FadeIn>
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


            {/* Grid de reportes */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allReports.map((report: Report) => (
                <FadeIn key={report._id.$oid}>
                  <ReportCard
                    report={report}
                    onDelete={() => deleteReport(report._id.$oid, "user")}
                    openPDF={() => openPDF(report)}
                  />
                </FadeIn>
              ))}
            </div>
          </div>

        ) : (
          <FadeIn>
            <div className="text-center">
              <h1 className="font-bold text-xl w-full">{t('empty')}😅</h1>
              <h1 className="font-bold text-xl w-full">{t('reporthere').split(" ")[0]} <Link className="text-blue underline decoration-wavy" href="/report">{t('reporthere').split(" ")[1]}</Link> {t('reporthere').split(" ")[2]}</h1>
            </div>
          </FadeIn>

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
