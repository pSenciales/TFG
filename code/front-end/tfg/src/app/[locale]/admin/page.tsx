// app/admin-portal/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Link } from '@/i18n/navigation';
import { useSession } from "next-auth/react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Users, FileText, PieChart } from "lucide-react";
import FadeIn  from "@/components/fadeIn";

import { useTranslations } from "next-intl";

export default function AdminPortal() {
  const { data: session, status } = useSession();

  const t = useTranslations("admin.portal");
  // Estado para la hora actual
  const [now, setNow] = useState(() => new Date());

  // Cada segundo actualizamos la hora
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
	
  if (status !== "loading" && ( !session || session.role != "admin")) {
    if (typeof window !== "undefined") {
      console.log("No tienes permisos para acceder a esta página o no estás autenticado.");
      window.location.href = "/login";
    }
    return null;
  }

  const cards = [
    {
      href: "/admin/reports",
      title: t('cards.reports.title'),
      description: t('cards.reports.subtitle'),
      icon: <FileText size={32} className="text-indigo-600" />,
    },
    {
      href: "/admin/banned",
      title: t('cards.bannedusers.title'),
      description: t('cards.bannedusers.subtitle'),
      icon: <Users size={32} className="text-green-600" />,
    },
    {
      href: "/admin/stats",
      title: t('cards.stats.title'),
      description: t('cards.stats.subtitle'),
      icon: <PieChart size={32} className="text-blue-600" />,
    },
  ];

  return (
    <div className="p-8 space-y-16">
      <FadeIn>

      <h1 className="text-4xl font-bold text-center my-10">{t('title')}</h1>

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
      <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
        {session?.user?.email && (
          <p>
           {t('loggedin')} <strong>{session.user.email}</strong>
          </p>
        )}
        <p>
          {t('time')}
          <time dateTime={now.toISOString()}>
            {now.toLocaleTimeString()}
          </time>
        </p>
      </div>
      </FadeIn>
    </div>
  );
}
