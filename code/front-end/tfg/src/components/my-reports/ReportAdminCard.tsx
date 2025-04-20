"use client";
import Image from "next/image";
import { Report } from "@/types/reports";
import TruncateText from "@/components/my-reports/TruncateText";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import Swal from "sweetalert2"

interface ReportCardProps {
    report: Report;
    onDelete: () => void;
    openPDF: () => void;
    banUser: () => void;
}

export default function ReportAdminCard({ report, onDelete, openPDF, banUser }: ReportCardProps) {


    const imageUrl = "/logo-no-bg.png";

    const dateString = new Date(report.created_at.$date).toDateString();
    const stateColor = report.state === "processing" ? "bg-yellow-600" : report.state === "accepted" ? "bg-green-600" : "bg-red-600";

    const hateColor = String(report.is_hate) === "true" ? "bg-red-600" : "bg-green-600";
    const hateText = String(report.is_hate) === "true" ? "Is hate" : "Not hate";
    const userEmail = report.notification_email;

    return (
        <div className="flex items-center w-[100%] max-h-xl rounded-lg border border-gray-200 bg-white shadow p-3 space-x-3 relative">
            <div className="w-24 h-16 relative overflow-hidden rounded-md">
                <Image
                    src={imageUrl}
                    alt="Report image"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start gap-2">
                    <span className="inline-block bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded-md">
                        {dateString}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                aria-label="More options"
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                </svg>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>{"Report #" + report._id.$oid.slice(0, 15)}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={
                                () => {
                                    openPDF();
                                }
                            }>
                                <div className="flex justify-between items-center w-full">

                                    <span> View</span>
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                        <circle cx="12" cy="12" r="3.5" stroke="#000000"></circle>
                                        <path d="M21 12C21 12 20 4 12 4C4 4 3 12 3 12" stroke="#000000"></path></svg>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={async () => {
                                    const confirmed = await Swal.fire({
                                        title: "Are you sure?",
                                        text: "This will delete the report permanently.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonText: "Yes, delete it!",
                                    });

                                    if (confirmed.isConfirmed) {
                                        onDelete();
                                    }
                                }}
                            >
                                <div className="flex justify-between items-center w-full">
                                    <span>Delete</span>
                                    <svg width="20" height="20" className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003">
                                        <path d="M12 2.75C11.0215 2.75 10.1871 3.37503 9.87787 4.24993C9.73983 
                                4.64047 9.31134 4.84517 8.9208 4.70713C8.53026 4.56909 8.32557 4.1406 8.46361 
                                3.75007C8.97804 2.29459 10.3661 1.25 12 1.25C13.634 1.25 15.022 2.29459 
                                15.5365 3.75007C15.6745 4.1406 15.4698 4.56909 15.0793 4.70713C14.6887 
                                4.84517 14.2602 4.64047 14.1222 4.24993C13.813 3.37503 12.9785 2.75 12 2.75Z"
                                            fill="#000000">
                                        </path>
                                        <path d="M2.75 6C2.75 5.58579 3.08579 5.25 3.5 5.25H20.5001C20.9143 5.25 21.2501 
                                    5.58579 21.2501 6C21.2501 6.41421 20.9143 6.75 20.5001 6.75H3.5C3.08579 6.75 2.75 6.41421 
                                    2.75 6Z" fill="#000000">
                                        </path>
                                        <path d="M5.91508 8.45011C5.88753 8.03681 5.53015 7.72411 5.11686 7.75166C4.70356 7.77921 
                                        4.39085 8.13659 4.41841 8.54989L4.88186 15.5016C4.96735 16.7844 5.03641 17.8205 5.19838 18.6336C5.36678 
                                        19.4789 5.6532 20.185 6.2448 20.7384C6.83639 21.2919 7.55994 21.5307 8.41459 21.6425C9.23663 21.75 10.2751 21.75 
                                        11.5607 21.75H12.4395C13.7251 21.75 14.7635 21.75 15.5856 21.6425C16.4402 21.5307 17.1638 21.2919 17.7554 
                                        20.7384C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9637 17.8205 19.0328 16.7844 19.1183 15.5016L19.5818 
                                        8.54989C19.6093 8.13659 19.2966 7.77921 18.8833 7.75166C18.47 7.72411 18.1126 8.03681 18.0851 8.45011L17.6251 
                                        15.3492C17.5353 16.6971 17.4712 17.6349 17.3307 18.3405C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 
                                        19.8988 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255
                                        20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8988 7.26957 19.6431C6.99616 19.3873 6.80583 19.025 6.66948 
                                        18.3405C6.52891 17.6349 6.46488 16.6971 6.37503 15.3492L5.91508 8.45011Z" fill="#000000">
                                        </path>
                                        <path d="M9.42546 10.2537C9.83762 10.2125 10.2051 10.5132 
                                            10.2464 10.9254L10.7464 15.9254C10.7876 16.3375 10.4869 16.7051 
                                            10.0747 16.7463C9.66256 16.7875 9.29502 16.4868 9.25381 16.0746L8.75381 
                                            11.0746C8.71259 10.6625 9.0133 10.2949 9.42546 10.2537Z" fill="#000000">
                                        </path>
                                        <path d="M15.2464 11.0746C15.2876 10.6625 14.9869 10.2949 14.5747 10.2537C14.1626 
                                                10.2125 13.795 10.5132 13.7538 10.9254L13.2538 15.9254C13.2126 16.3375 13.5133 16.7051
                                                13.9255 16.7463C14.3376 16.7875 14.7051 16.4868 14.7464 16.0746L15.2464 11.0746Z" fill="#000000">
                                        </path>
                                    </svg>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    banUser()
                                }}


                            >
                                <div className="flex justify-between items-center w-full">

                                    <span>Ban user</span>
                                    <svg width="20" height="20" fill="#ff0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000">
                                        <path d="M16 1.25c-8.146 0-14.75 6.604-14.75 14.75s6.604 
                                        14.75 14.75 14.75c8.146 0 14.75-6.604 14.75-14.75v0c-0.010-8.142-6.608-14.74-14.749-14.75h-0.001zM29.25 
                                        16c-0 3.344-1.246 6.397-3.298 8.72l0.012-0.014-18.77-18.578c2.331-2.096 
                                        5.43-3.378 8.829-3.378 7.305 0 13.227 5.922 13.227 13.227 0 0.008 0 0.016-0 0.024v-0.001zM2.75 16c0.001-3.394 
                                        1.285-6.488 3.393-8.824l-0.010 0.012 18.78 18.588c-2.345 2.154-5.486 3.474-8.935 3.474-7.305 
                                        0-13.228-5.922-13.228-13.228 0-0.008 0-0.016 0-0.024v0.001z"></path>
                                    </svg>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                {/* Texto del reporte */}
                <p className="text-sm text-gray-800 font-medium mt-1">
                    {"Content: "}
                    <TruncateText text={report.content} />
                </p>

                <TooltipProvider>
                    <Tooltip >
                        <TooltipTrigger asChild>
                            <p className="text-sm text-gray-800 font-medium mt-1">
                                {"User: "}

                                <TruncateText text={userEmail} />

                            </p>
                        </TooltipTrigger>
                        <TooltipContent
                            side="bottom"
                            align="center"
                            sideOffset={4}
                            slideFrom="top"
                        >
                            <p>{userEmail.length <= 40 ? userEmail : userEmail.slice(0, 37) + "..."}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

            <span
                className={`absolute bottom-10 right-1 text-white text-xs font-semibold py-1 px-2 rounded-full ${hateColor}`}
                title="Is Hate"
            >
                {hateText}
            </span>

            <span
                className={`absolute bottom-3 right-1 text-white text-xs font-semibold py-1 px-2 rounded-full ${stateColor}`}
                title="Current State"
            >
                {report.state}
            </span>
        </div>
    );
}
