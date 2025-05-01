// app/admin-portal/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Users, FileText, PieChart } from "lucide-react";

export default function AdminPortal() {
  const { data: session } = useSession();

  // Estado para la hora actual
  const [now, setNow] = useState(() => new Date());

  // Cada segundo actualizamos la hora
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!session || session.role != "admin") {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const cards = [
    {
      href: "/admin/reports",
      title: "Manage Reports",
      description: "Review & resolve user reports",
      icon: <FileText size={32} className="text-indigo-600" />,
    },
    {
      href: "/admin/banned",
      title: "Banned Users",
      description: "View and unban users",
      icon: <Users size={32} className="text-green-600" />,
    },
    {
      href: "/admin/stats",
      title: "Analytics",
      description: "Charts & key metrics",
      icon: <PieChart size={32} className="text-blue-600" />,
    },
  ];

  return (
    <div className="p-8 space-y-16">
      <h1 className="text-4xl font-bold text-center">Admin Portal</h1>

      <BentoGrid className="gap-8">
        {cards.map((card) => (
          <Link href={card.href} key={card.href}>
            <BentoGridItem
              icon={card.icon}
              title={card.title}
              description={card.description}
              className="hover:border-indigo-300 cursor-pointer"
            />
          </Link>
        ))}
      </BentoGrid>

      {/* Pie de página con hora en vivo */}
      <div className="mt-12 text-center text-sm text-gray-500 space-y-1">
        {session?.user?.email && (
          <p>
            Logged in as <strong>{session.user.email}</strong>
          </p>
        )}
        <p>
          Current time:{" "}
          <time dateTime={now.toISOString()}>
            {now.toLocaleTimeString()}
          </time>
        </p>
        <p>
          Need help? Visit our{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Help Center
          </a>
          .
        </p>
      </div>
    </div>
  );
}
