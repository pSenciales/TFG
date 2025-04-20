"use client";

import { useState } from "react";
import { Report } from "@/types/reports"; 
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import { useSession, signOut } from "next-auth/react";
import { ReportsResponse } from "@/types/reports";


export function useMyReports() {

  const { data: session, status } = useSession();
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

     async function deleteReport(reportId: string): Promise<void> {
        try {
          await axios.post("/api/proxy", {
            method: "delete",
            url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports/${reportId}`,
          });
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
          await axios.post("/api/proxy", {
            method: "post",
            url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/blacklist`,
            body: {
              email: notification_email
            }
          });
        } catch (error) {
          console.error("Error banning user", error);
        }
      }
    
      function applyFilters() {
        const statuses: string[] = [];
        let count = 0;
        if(!isHateCheckBox || !notHateCheckBox) count++;
        if (processingCheckBox) statuses.push("processing");
        if (acceptedCheckBox) statuses.push("accepted");
        if (rejectedCheckBox) statuses.push("rejected");
        
        count += (3-statuses.length);

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
          isAdmin,
          pageParam = 0
        }: {
          isAdmin: boolean;
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
          let url = `${process.env.NEXT_PUBLIC_FLASK_API_URL}/reports`
          if(isAdmin){
            url += "/admin?";
            if (filterEmail) {
              params.set("searchEmail", filterEmail);
            }
          }else{
            url += "/user?";
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
