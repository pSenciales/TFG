"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import LanguageSwitcher from './languageSwitcher';

function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  return words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
}

export default function NavBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const t = useTranslations();

  // Translated doc components
  const docComponents = [
    {
      title: t('docComponents.llm.title'),
      href: "https://api-docs.deepseek.com/news/news250120",
      description: t('docComponents.llm.description'),
    },
    {
      title: t('docComponents.ocr.title'),
      href: "https://cloud.google.com/vision/docs?hl=es-419",
      description: t('docComponents.ocr.description'),
    },
    {
      title: t('docComponents.frontend.title'),
      href: "https://nextjs.org/docs",
      description: t('docComponents.frontend.description'),
    },
    {
      title: t('docComponents.backend.title'),
      href: "https://flask.palletsprojects.com/en/stable/",
      description: t('docComponents.backend.description'),
    },
    {
      title: t('docComponents.orm.title'),
      href: "https://docs.mongoengine.org/",
      description: t('docComponents.orm.description'),
    },
    {
      title: t('docComponents.database.title'),
      href: "https://www.mongodb.com/docs/",
      description: t('docComponents.database.description'),
    },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
        {/* Logo y hamburguesa */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo-no-bg.png" alt="logo" width={40} height={40} />
            <span className="font-bold text-md md:text-xl">Fairplay360</span>
          </Link>
          {/* Boton hamburguesa para móviles */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Navegación para desktop */}
        <div className="hidden md:flex items-center space-x-4">

          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              {/* Denuncia: enlace simple */}
              <NavigationMenuItem>
                <Link href="/report" className={navigationMenuTriggerStyle()}>
                  {t('navbar.report')}
                </Link>
              </NavigationMenuItem>
              {/* Documentación: menú desplegable */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('navbar.docs')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {docComponents.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Contacto: enlace simple */}
              <NavigationMenuItem>
                <Link href="/contact" className={navigationMenuTriggerStyle()}>
                  {t('navbar.contact')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Botones de sesión */}
        <div className="flex items-center">


          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-all border border-silver">
                  {session.user?.image ? (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                    />
                  ) : (
                    <AvatarFallback className="bg-black text-white">
                      {session.user?.name ? getInitials(session.user.name) : "NA"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  {t('navbar.hello', { name: session.user?.name ? session.user.name.split(" ")[0] : t('navbar.guest') })}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <Link href="/my-reports">{t('navbar.myReports')}</Link>
                </DropdownMenuItem>
                {session.role === "admin" ? (
                  <DropdownMenuItem >
                    <Link href="/admin">{t('navbar.adminPortal')}</Link>
                  </DropdownMenuItem>
                ) :
                  (
                    <>
                    </>
                  )}
                <DropdownMenuItem>
                  <Link href="/profile">{t('navbar.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  {t('navbar.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          ) : (
            <div className="flex items-center gap-4">
              {/* Se muestra solo en md y arriba */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              <Button variant="outline">
                <Link href="/login">
                  {t('navbar.login')}
                </Link>
              </Button>

              <Button>
                <Link href="/signup">
                  {t('navbar.signup')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Menu para el movil */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <LanguageSwitcher />
            </li>
            <li>
              <Link
                href="/report"
                onClick={() => setMenuOpen(false)}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                {t('navbar.report')}
              </Link>
            </li>
            {/* Desplegable documentacion */}
            <li>
              <button
                onClick={() => setDocOpen((prev) => !prev)}
                className="w-full text-left block p-2 hover:bg-gray-100 rounded"
              >
                {t('navbar.docs')}
              </button>
              {docOpen && (
                <ul className="pl-4 mt-1 space-y-1">
                  {docComponents.map((component) => (
                    <li key={component.title}>
                      <Link
                        href={component.href as "/"}
                        onClick={() => setMenuOpen(false)}
                        className="block p-2 hover:bg-gray-100 rounded"
                      >
                        {component.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {/* Contacto */}
            <li>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                {t('navbar.contact')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
