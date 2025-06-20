"use client";
import { Report } from "@/types/reports";
import DropdownActions from "@/components/my-reports/DropdownActions";
import TruncateText from "@/components/my-reports/TruncateText";

import { useTranslations } from "next-intl";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface ReportCardProps {
    report: Report;
    onDelete: () => void;
    openPDF: () => void;
    banUser: () => void;
    handleResolve: () => void;
}


export default function ReportAdminCard({ report, onDelete, openPDF, banUser, handleResolve }: ReportCardProps) {

    const t = useTranslations("myreports");  


    const dateString = new Date(report.created_at.$date).toLocaleDateString();
    const stateColor = report.state === "processing" ? "bg-yellow-600" : report.state === "accepted" ? "bg-green-600" : "bg-red-600";
    const state = report.state === "processing" ? t('status.processing') : report.state === "accepted" ? t('status.accepted') : t('status.rejected');


    const hateColor = String(report.is_hate) === "true" ? "bg-red-600" : "bg-green-600";
    const hateText = String(report.is_hate) === "true" ? t('hate.true') : t('hate.false');
    const userEmail = report.notification_email;

    return (
        <div className="flex items-center w-[100%] max-h-xl rounded-lg border border-gray-200 bg-white shadow p-3 space-x-3 relative">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start gap-2">
                    <span className="inline-block bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded-md">
                        {dateString}
                    </span>
                    <DropdownActions
                        reportId={report._id.$oid}
                        onDelete={onDelete}
                        openPDF={openPDF}
                        banUser={banUser}
                        handleResolve={handleResolve}
                    />
                </div>

                <p className="text-sm text-gray-800 font-medium mt-1">
                    {t('table.content')}
                    <TruncateText text={report.content} />
                </p>

                <TooltipProvider>
                    <Tooltip >
                        <TooltipTrigger asChild>
                            <p className="text-sm text-gray-800 font-medium mt-1">
                                {t('table.user')}

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
                {state}
            </span>
        </div>
    );
}
