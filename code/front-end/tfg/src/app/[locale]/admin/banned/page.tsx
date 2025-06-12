"use client";

import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import FadeIn from "@/components/fadeIn";
import { ThreeDot } from "react-loading-indicators";
import { useBanned } from "@/hooks/useBanned";
import SearchBar from "@/components/my-reports/SearchBar";
import { BannedUser, BannedUsersResponse } from "@/types/banned";
import BannedCard from "@/components/banned/BannedCard";

import { useTranslations } from "next-intl";


export default function Banned() {
  const {
    session,
    status,
    filterEmail,
    appliedFilters,
    setAppliedFilters,
    setFilterEmail,
    fetchBanned,
    restoreAccess
  } = useBanned();

  const t = useTranslations("admin.bannedusers");

  type BannedQueryKey = ["users", { appliedFilters: string }];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    BannedUsersResponse,
    Error,
    BannedUsersResponse,
    BannedQueryKey,
    number
  >({
    queryKey: ["users", { appliedFilters }] as BannedQueryKey,
    enabled: status === "authenticated",
    queryFn: ({ pageParam = 0 }) => fetchBanned({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor !== null ? lastPage.nextCursor : undefined,
  });


  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
    });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "loading" || isLoading) {
    return (
      <FadeIn>
        <p className="mt-20 text-center">
          {t('loading')} <ThreeDot color="#000" size="small" />
        </p>
      </FadeIn>
    );
  }

  if (!session || session.role !== "admin") {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  if (isError) {
    return <div className="text-center text-red-600">{t('errorloading')}</div>;
  }

  // @ts-expect-error typescript no typea correctamente data
  const allUsers: BannedUser[] = data?.pages.flatMap((p) => p.users) ?? [];

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4">
      <FadeIn duration={0.5}>
        <h1 className="text-3xl font-bold text-center mt-10">
          {t("title")}
        </h1>
      </FadeIn>

      <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-row items-end space-x-4">
          <SearchBar
            filterEmail={filterEmail}
            setFilterEmail={setFilterEmail}
            applyFilters={() => setAppliedFilters(filterEmail)}
          />
        </div>
      </div>

      {allUsers.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allUsers.map((user) => (
              <FadeIn key={user.email}>
                <BannedCard
                  user={user}
                  restoreAccess={() => restoreAccess(user.email)}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      ) : (
        <FadeIn>
          <p className="text-center font-bold">
            {t('empty')}😅
          </p>
        </FadeIn>
      )}

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
      {isFetchingNextPage && (
        <p className="text-center">
          {t('loading')} <ThreeDot color="#000" size="small" />
        </p>
      )}
    </div>
  );
}
