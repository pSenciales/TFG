"use client"
import React from "react";
import Link from "next/link";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import FadeIn from "@/components/fadeIn";

import { useTranslations } from "next-intl";

export default function ContactPage() {
  const GITHUB_REPO = "https://github.com/pSenciales/TFG";

  const t = useTranslations("contact");

  return (
    <FadeIn>
      <main className="max-w-xl mx-auto p-8 space-y-6">
        <section className="text-center space-y-2">

          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
          {t('subtitle')} ⭐ {t('subtitle2')}
          </p>
        </section>

        <Card className="p-6 flex flex-col items-center space-y-4">
          <Image src="/github-mark.svg" alt="GitHub Logo" width={48} height={48} />
          <CardTitle className="text-lg">{t('repository')}</CardTitle>
          <CardContent className="text-center text-sm text-muted-foreground">
            {GITHUB_REPO}
          </CardContent>
          <Button
            variant="outline"
            asChild
            className="flex items-center space-x-2"
          >
            <Link href={GITHUB_REPO} target="_blank" rel="noopener">
              <Star size={16} /> {t('star')}
            </Link>
          </Button>
        </Card>

        <section className="text-center text-sm text-muted-foreground">
          <p>
            {t('footer')}
            <a
              href="mailto:fairplay360app@gmail.com"
              className="underline hover:text-foreground"
            >
              fairplay360app@gmail.com
            </a>
              {t('footer2')}
          </p>
        </section>
      </main>
    </FadeIn>
  );
}
