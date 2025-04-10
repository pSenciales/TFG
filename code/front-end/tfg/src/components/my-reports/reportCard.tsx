"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ReportCardProps{
    content: string;
    context: string;
    source: string;
    url: string;
    createdAt: string;
    isHate: boolean;
}


export function ReportCard({content, context, source, url, createdAt, isHate}: ReportCardProps) {
  return (
    <div className="max-w-xs w-full group/card">
    <div
      className={cn(
        " cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto flex flex-col justify-between p-4",
        "bg-[url('/pdfLogo.png')] bg-cover"
      )}
    >
      <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
      <div className="flex flex-row items-center space-x-4 z-10">
        <div className="flex flex-col">
        <p className="font-normal text-base text-gray-50 relative z-10">
          Report
        </p>
        <p className="text-sm text-gray-400">{createdAt}</p>
        </div>
      </div>
      <div className="text content">
        <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
        {content.split(" ").slice(0, 10).join(" ")}
        </h1>
        <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
        {source}
        </p>
      </div>
    </div>
    </div>
  );
}
