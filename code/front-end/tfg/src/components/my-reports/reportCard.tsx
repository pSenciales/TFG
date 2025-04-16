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
  admin: boolean;
}

export default function ReportCard({ report, onDelete, openPDF, admin }: ReportCardProps) {


  // Ejemplo: Si tu Report no trae imagen, puedes usar un placeholder
  const imageUrl = "/logo-no-bg.png";

  const dateString = new Date(report.created_at.$date).toDateString();
  // => 'Thu Apr 24 2025'. Ajústalo como quieras
  const stateColor = report.state === "processing" ? "bg-yellow-600" : report.state === "accepted" ? "bg-green-600" : "bg-red-600";

  const hateColor = String(report.is_hate) === "true" ? "bg-red-600" : "bg-green-600";
  const hateText = String(report.is_hate) === "true" ? "Is hate" : "Not hate";

  const sourceOrEmail = admin ? report.notification_email : report.source;

  return (
    <div className="flex items-center w-[100%] max-h-xl rounded-lg border border-gray-200 bg-white shadow p-3 space-x-3 relative">
      {/* Imagen a la izquierda (ajusta el tamaño) */}
      <div className="w-24 h-16 relative overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt="Report image"
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido textual principal */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-start gap-2">
          {/* Etiqueta de hora */}
          <span className="inline-block bg-gray-800 text-white text-xs font-medium px-2 py-0.5 rounded-md">
            {dateString}
          </span>

          {/* Menú (los tres puntos) */}
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
                View
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3.5" stroke="#000000"></circle>
                  <path d="M21 12C21 12 20 4 12 4C4 4 3 12 3 12" stroke="#000000"></path></svg>

              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Texto del reporte */}
        <p className="text-sm text-gray-800 font-medium mt-1">
        {"Content: "}
          <TruncateText text={report.content}/>
        </p>

        <TooltipProvider>
          <Tooltip >
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-800 font-medium mt-1">
                {(
                  admin ?
                    (
                      <>
                      {"User: "}

                        <TruncateText text={sourceOrEmail}/>
                    </>
                    )
                    :
                    (
                      <>
                        {"Source: "} <a href={sourceOrEmail}>
                        <TruncateText text={sourceOrEmail}/>
                        </a>
                      </>
                    )

                )}

              </p>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="center"
              sideOffset={4}
              slideFrom="top"
            >
              <p>{sourceOrEmail.length <= 40 ? sourceOrEmail : sourceOrEmail.slice(0, 37) + "..."}</p>
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
