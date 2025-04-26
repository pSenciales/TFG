"use client";

import { useState } from "react";
import { Report } from "@/types/reports";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { useSession, signOut } from "next-auth/react";
import { ReportsResponse } from "@/types/reports";
import { useQueryClient } from "@tanstack/react-query";



export function useMyReports() {

  const { data: session, status } = useSession();
  const queryClient = useQueryClient();


  const [filterEmail, setFilterEmail] = useState("");

  const [sortBy, setSortBy] = useState("date_desc");

  const [isHateCheckBox, setIsHateCheckBox] = useState(true);
  const [notHateCheckBox, setNotHateCheckBox] = useState(true);

  const [processingCheckBox, setProcessingCheckBox] = useState(true);
  const [acceptedCheckBox, setAcceptedCheckBox] = useState(true);
  const [rejectedCheckBox, setRejectedCheckBox] = useState(true);

  const [filtersCount, setFiltersCount] = useState(0);

  function toggleCheckbox(
    current: boolean,
    others: boolean[],
    setCurrent: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const next = !current;

    const anyOtherChecked = others.some(o => o);
    if (!next && !anyOtherChecked) return;

    setCurrent(next);
  }

  const [appliedFilters, setAppliedFilters] = useState({
    filterEmail: "",
    sortBy: "date_desc",
    includeHate: true,
    includeNotHate: true,
    statuses: ["processing", "accepted", "rejected"] as string[],
  });

  async function deleteReport(reportId: string): Promise<number | undefined> {
    try {
      const { status } = await axios.post("/api/proxy", {
        method: "delete",
        url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/${reportId}`,
      });

      queryClient.invalidateQueries({ queryKey: ["reports"] });

      return status;
    } catch (error) {
      console.error("Error deleting report", error);
    }
  }

  async function deleteReportAndLog(reportId: string): Promise<void> {
    try {

      const statusDelete = await deleteReport(reportId);

      if (statusDelete === 200) {
        await axios.post("/api/proxy", {
          method: "post",
          url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/logs`,
          body: {
            action: "Deleted a report with id: " + reportId,
            user_id: session?.user.id
          }
        });
      }
    } catch (error) {
      console.error("Error deleting report", error);
    }
  }

  function openPDF(report: Report): void {
    if (report.pdf && report.pdf[0]?.url) {
      window.open(report.pdf[0].url, '_blank');
    }
  }

  async function banUser(notification_email: string): Promise<void> {
    try {
      const { status } = await axios.post("/api/proxy", {
        method: "post",
        url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/blacklist`,
        body: {
          email: notification_email
        }
      });

      if (status === 201) {
        await axios.post("/api/proxy", {
          method: "post",
          url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/logs`,
          body: {
            action: "Banned a user with email: " + notification_email,
            user_id: session?.user.id
          }
        });
      }

    } catch (error) {
      console.error("Error banning user", error);
    }
  }

  async function handleResolve(
    reportId: string,
    email: string,
  ) {
    const result = await Swal.fire<{
      resolution: string;
      status: string;
    }>({
      title: "Resolve Report",
      html: `
        <div class="space-y-4 text-left">
          <textarea
            id="swal-resolution"
            class="block w-full min-h-[6rem] rounded-md border border-input bg-transparent px-3 py-2 text-sm text-input placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            placeholder="Enter resolution details…"
          ></textarea>
          <select
            id="swal-status"
            class="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="processing">Processing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        const resolutionEl = document.getElementById(
          "swal-resolution"
        ) as HTMLTextAreaElement;
        const statusEl = document.getElementById(
          "swal-status"
        ) as HTMLSelectElement;
        const resolution = resolutionEl.value;
        const status = statusEl.value;

        // Aquí se muestra el loader automáticamente
        const res = await axios.post("/api/resolve", {
          resolution: {
            action: `Resolved with status ${status} the report with id: ${reportId}`,
            reason: resolution,
            user_id: session?.user.id
          },
          state: status,
          reportId,
          email,
        });
        if (res.status !== 200) {
          throw new Error("Failed to save resolution");
        }
        return { status };
      },
    });

    if (result.isConfirmed && result.value) {
      Swal.fire("Saved!", "La resolución se ha guardado.", "success");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }
  }

  function applyFilters() {
    const statuses: string[] = [];
    let count = 0;
    if (!isHateCheckBox || !notHateCheckBox) count++;
    if (processingCheckBox) statuses.push("processing");
    if (acceptedCheckBox) statuses.push("accepted");
    if (rejectedCheckBox) statuses.push("rejected");

    count += (3 - statuses.length);

    setFiltersCount(count);
    setAppliedFilters({
      filterEmail: filterEmail,
      sortBy: sortBy,
      includeHate: isHateCheckBox,
      includeNotHate: notHateCheckBox,
      statuses: statuses
    });
  }

  async function fetchReports({
    urlUser,
    pageParam = 0
  }: {
    urlUser: string;
    pageParam?: number;
  }) {

    // Dentro de fetchReports o donde montes la URL:
    const email = session?.user?.email ?? "";
    const provider = session?.provider ?? "";
    const cursor = pageParam || 0;      // o el valor que saques de pageParam
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
    let url = `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/${urlUser}?`;
    if (filterEmail) {
      params.set("searchEmail", filterEmail);
    }

    url += params.toString();

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






  return {
    toggleCheckbox,
    applyFilters,
    banUser,
    openPDF,
    deleteReport,
    deleteReportAndLog,
    handleResolve,
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
  };
}
