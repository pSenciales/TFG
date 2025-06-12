"use client";

import React, { useRef, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReportsResponse, Filters } from "@/types/reports";
import FadeIn from "@/components/fadeIn";
import { ThreeDot } from "react-loading-indicators";
import { useMyReports } from "@/hooks/useMyReports";

import SortAndFilterButton from "@/components/my-reports/SortAndFilterButton";
import SearchBar from "@/components/my-reports/SearchBar";
import { Button } from "@/components/ui/button";

import GridReports from "@/components/my-reports/GridReports";
import TableReports from "@/components/my-reports/TableReports";

import { useTranslations } from "next-intl";

// Función de fetch para useInfiniteQuery


export default function MyReports() {


  const [table, setTable] = useState(false);
  const [tableButtonStyle, setTableButtonStyle] = useState<"ghost" | "outline">("ghost");

  const t = useTranslations();

  const {
    toggleCheckbox,
    applyFilters,
    banUser,
    openPDF,
    handleResolve,
    deleteReportAndLog,
    setFilterEmail,
    appliedFilters,
    filterEmail,
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

  type ReportsQueryKey = ["reportsAdmin", Filters];

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
      "reportsAdmin",
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
    queryFn: ({ pageParam = 0 }) => fetchReports({ pageParam, urlUser: "admin" }),
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

      {t('myreports.loading')} <ThreeDot color="#000000" size="small" />
    </p></div> </FadeIn>;
  }
  if (!session || session.role != "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  if (isError) {
    return <div>{t('myreports.errorloading')}</div>;
  }

  // @ts-expect-error typescript no typea correctamente data
  const allReports = data?.pages?.flatMap((page: ReportsResponse) => page.reports) ?? [];

  function handleTableChange() {
    setTable(!table);
    if (table) {
      setTableButtonStyle("ghost")
    } else {
      setTableButtonStyle("outline")
    }

  }

  function RenderGrid() {
    return (
      <GridReports
        allReports={allReports}
        openPDF={openPDF}
        banUser={banUser}
        handleResolve={handleResolve}
        deleteReportAndLog={deleteReportAndLog}
      />
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4">
      <FadeIn duration={0.5}>
        <h1 className="text-center text-3xl font-bold mt-10">{t('admin.report.title')}</h1>
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
            {/* Search bar */}
            <SearchBar
              filterEmail={filterEmail}
              setFilterEmail={setFilterEmail}
              applyFilters={applyFilters}
            />

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

            <div className="hidden md:block">
              <Button variant={tableButtonStyle} size="icon" onClick={handleTableChange}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M3 15H21M9 9L9 20M15 9L15 20M6.2 20H17.8C18.9201 20 19.4802 
                20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 
                17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 
                4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 
                4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 
                7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 
                19.782C4.51984 20 5.07989 20 6.2 20Z" stroke="#000000" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round">
                  </path>
                </svg>
              </Button>
            </div>
          </div>
        </div>

      </FadeIn>
      {
        allReports && allReports.length > 0 ? (
          <FadeIn>

            <>
              <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
                {/* Grid con los reportes */}


                <div className="block lg:hidden">

                  <RenderGrid />

                </div>
                {table ? (
                  <div className="hidden lg:block">
                    <TableReports
                      allReports={allReports}
                      openPDF={openPDF}
                      banUser={banUser}
                      handleResolve={handleResolve}
                      deleteReportAndLog={deleteReportAndLog}
                    />
                  </div>
                ) : (
                  <div className="hidden lg:block">
                    <RenderGrid />
                  </div>
                )
                }

              </div>
            </>
          </FadeIn>

        ) : (
          <FadeIn>
            <div className="text-center">
              <h1 className="font-bold text-xl w-full">{t('myreports.empty')}😅</h1>
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

          {t('myreports.loading')} <ThreeDot color="#000000" size="large" />
        </p>
      )}
    </div>
  );
}


