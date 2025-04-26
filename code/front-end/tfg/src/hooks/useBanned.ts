"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { BannedUsersResponse, BannedUser } from "@/types/banned";

export function useBanned() {
  const { data: session, status } = useSession();
  const [filterEmail, setFilterEmail] = useState("");

  async function fetchBanned({
    pageParam = 0,
  }: {
    pageParam?: number;
  }): Promise<BannedUsersResponse & { currentCursor: number }> {
    const cursor = pageParam;
    const params = new URLSearchParams({ cursor: String(cursor) });
    if (filterEmail) params.set("searchEmail", filterEmail);

    try {
      const res = await axios.post(
        "/api/proxy",
        {
          url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/blacklist?${params.toString()}`,
          method: "get",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // Si res.data es un string, lo parseamos
      const payload = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      // payload.users o payload (array directamente)
      const rawUsers: any[] = payload.users ?? payload;
      const users: BannedUser[] = rawUsers.map((u) => ({
        email: u._id ?? u.email,
        created_at: u.created_at ?? Date.now(),
      }));

      return {
        users,
        nextCursor: payload.nextCursor ?? null,
        currentCursor: cursor,
      };
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data.error === "Session expired or invalid token"
      ) {
        await Swal.fire({
          title: "Session expired",
          text: "Please log in again",
          icon: "warning",
        });
        signOut();
        if (typeof window !== "undefined") window.location.href = "/login";
      } else {
        console.error(error);
        Swal.fire("Error", "Could not fetch banned users.", "error");
      }
      return {
        users: [],
        nextCursor: null,
        currentCursor: cursor,
      };
    }
  }

  return {
    session,
    status,
    filterEmail,
    setFilterEmail,
    fetchBanned,
  };
}
