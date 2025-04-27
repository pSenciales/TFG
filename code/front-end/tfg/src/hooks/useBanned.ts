"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { BannedUsersResponse, BannedUser } from "@/types/banned";


export function useBanned() {
  const { data: session, status } = useSession();
  const [filterEmail, setFilterEmail] = useState("");
  const [appliedFilters, setAppliedFilters] = useState("");
  const queryClient = useQueryClient();


  interface RawBannedRecord {
  _id: string;
  created_at?: { $date: number };
  email?: string;
}

  async function fetchBanned({
    pageParam = 0,
  }: {
    pageParam?: number;
  }): Promise<BannedUsersResponse & { currentCursor: number }> {
    const cursor = pageParam;
    const params = new URLSearchParams({ cursor: String(cursor)});
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

      // 1) Parsear si viene string
      const parsed = typeof res.data === "string"
        ? JSON.parse(res.data)
        : res.data;

      // 2) Extraer array de RawBannedRecord
      const rawUsers: RawBannedRecord[] = Array.isArray(parsed)
        ? parsed
        : (parsed as { users: RawBannedRecord[] }).users;

      // 3) Mapear al tipo BannedUser
      const users: BannedUser[] = rawUsers.map((u) => ({
        email: u._id ?? u.email!,
        created_at: u.created_at 
          ? u.created_at 
          : { $date: Date.now() },
      }));

      const nextCursor = (parsed as any).nextCursor ?? null;

      return { users, nextCursor, currentCursor: cursor };
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

  async function restoreAccess(email: string): Promise<void> {
    try {
      const res = await axios.post(
        "/api/proxy",
        {
          url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/blacklist/${email}`,
          method: "delete",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        await axios.post("/api/proxy", {
                  method: "post",
                  url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/logs`,
                  body: {
                    action: "Restored access to email: " + email,
                    user_id: session?.user.id
                  }
                }).then(() => {
                  Swal.fire("Success", "Access restored successfully.", "success");
                });
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        Swal.fire("Error", "Could not restore user access.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not restore user access.", "error");
    }
  }

  return {
    session,
    status,
    filterEmail,
    setFilterEmail,
    fetchBanned,
    appliedFilters,
    setAppliedFilters,
    restoreAccess
  };
}
