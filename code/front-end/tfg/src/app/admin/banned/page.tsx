"use client";

import React, { useRef, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import FadeIn from "@/components/fadeIn";
import { ThreeDot } from "react-loading-indicators";
import { useBanned } from "@/hooks/useBanned";
import SearchBar from "@/components/my-reports/SearchBar";
import { BannedUser, BannedUsersResponse } from "@/types/banned";

export default function Banned() {
  const queryClient = useQueryClient();
  const { session, status, filterEmail, setFilterEmail, fetchBanned } = useBanned();

  type BannedQueryKey = ["users", { filterEmail: string }];

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<
    BannedUsersResponse,
    Error,
    BannedUsersResponse,
    BannedQueryKey,
    number
  >({
    queryKey: ["users", { filterEmail }] as BannedQueryKey,
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
          Loading users <ThreeDot color="#000" size="small" />
        </p>
      </FadeIn>
    );
  }

  if (!session || session.role !== "admin") {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  if (isError) {
    return <div className="text-center text-red-600">Error loading users</div>;
  }

  // @ts-expect-error typescript no typea correctamente data
  const allUsers: BannedUser[] = data?.pages.flatMap((p) => p.users) ?? [];

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4">
      <FadeIn duration={0.5}>
        <h1 className="text-3xl font-bold text-center mt-10">
          Banned Users
        </h1>
      </FadeIn>

      <div className="w-full max-w-7xl mx-auto px-4">
        
      </div>

      {allUsers.length > 0 ? (
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allUsers.map((user) => (
              <FadeIn key={user.email}>
                <div className="p-4 border rounded shadow">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Banned on {new Date(user.created_at.$date).toLocaleString()}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center font-bold">
          ¡Vaya! No hay usuarios baneados que mostrar.
        </p>
      )}

      {hasNextPage && <div ref={sentinelRef} style={{ height: 1 }} />}
      {isFetchingNextPage && (
        <p className="text-center">
          Loading more… <ThreeDot color="#000" size="small" />
        </p>
      )}
    </div>
  );
}
