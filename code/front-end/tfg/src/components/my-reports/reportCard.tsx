"use client";
import Image from "next/image";
import { Report } from "@/types/reports";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReportCardProps {
  report: Report;
}

export default function ReportCard({ report }: ReportCardProps) {


  // Ejemplo: Si tu Report no trae imagen, puedes usar un placeholder
  const imageUrl = "/logo-no-bg.png";

  const dateString = new Date(report.created_at.$date).toDateString();
  // => 'Thu Apr 24 2025'. Ajústalo como quieras
  const color = report.state === "processing" ? "bg-yellow-600" : report.state === "accepted" ? "bg-green-500" : "bg-red-500";

  return (
    <div className="flex items-center w-full max-w-md rounded-lg border border-gray-200 bg-white shadow p-3 space-x-3 relative">
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
            {new Date(report.created_at.$date).toDateString()}
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
              <DropdownMenuItem>
                Download
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.5"
                    d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                    stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="#000000" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round">
                  </path>
                </svg>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                if (report.pdf && report.pdf[0]?.url) {
                  window.open(report.pdf[0].url, '_blank');
                }
              }}>
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>

        {/* Texto del reporte */}
        <p className="text-sm text-gray-800 font-medium mt-1">
          Content: {report.content.slice(0, 15) + "..."}
        </p>
        <p className="text-sm text-gray-800 font-medium mt-1">
          Source: <a href={report.source}>{report.source.slice(0, 15) + "..."}</a>
        </p>
      </div>

      {/* Badge / estado (cerrado, abierto, etc.) */}
      <div className="self-end">
        <span
          className={`ml-3 inline-block text-white text-xs font-semibold py-1 px-2 rounded-full ${color}`}
          title="Current state"
        >
          {report.state}
        </span>
      </div>
    </div>
  );
}
