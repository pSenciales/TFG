"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// Sub-elementos para el menú de "Documentación"
const docComponents = [
  {
    title: "LLM",
    href: "https://api-docs.deepseek.com/news/news250120",
    description: "We use the DeepSeek R1 API to analyze content and detect hate speech.",
  },
  {
    title: "OCR",
    href: "https://cloud.google.com/vision/docs?hl=es-419",
    description: "We rely on the Google Vision API for optical character recognition.",
  },
  {
    title: "Front-end",
    href: "https://nextjs.org/docs",
    description: "Next.js powers our front-end, with key functionality provided by its built-in server.",
  },
  {
    title: "Back-end",
    href: "https://flask.palletsprojects.com/en/stable/",
    description: "Flask serves as our back-end framework.",
  },
  {
    title: "ORM",
    href: "https://docs.mongoengine.org/",
    description: "MongoEngine offers powerful ORM features, making data modeling simple.",
  },
  {
    title: "Database",
    href: "https://www.mongodb.com/docs/",
    description: "We use MongoDB for its flexibility and scalability.",
  },
];


function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  return words.slice(0, 2).map(word => word[0]).join("").toUpperCase();
}


export default function NavBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  console.log(session);
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
                  Report
                </Link>
              </NavigationMenuItem>
              {/* Documentación: menú desplegable */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
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
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Botones de sesión */}
        <div className="flex items-center space-x-4">
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
                <DropdownMenuLabel>Hello, {session.user?.name ? session.user.name.split(" ")[0] : "Guest"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                  <Link href={"/my-reports"}>My Reports</Link>
                </DropdownMenuItem>
                {session.role === "admin" ? (
                  <DropdownMenuItem >
                  <Link href={"/admin"}>Admin Portal</Link>
                </DropdownMenuItem>
                ) :
                  (
                    <>
                    </>
                  )}
                <DropdownMenuItem>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          ) : (
            <>
              <Button variant="outline" onClick={() => (window.location.href = "/login")}>
                Log In
              </Button>
              <Button onClick={() => (window.location.href = "/signup")}>Sign up</Button>
            </>
          )}
        </div>
      </div>

      {/* Menu para el movil */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link
                href="/report"
                onClick={() => setMenuOpen(false)}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                Report
              </Link>
            </li>
            {/* Desplegable documentacion */}
            <li>
              <button
                onClick={() => setDocOpen((prev) => !prev)}
                className="w-full text-left block p-2 hover:bg-gray-100 rounded"
              >
                Docs
              </button>
              {docOpen && (
                <ul className="pl-4 mt-1 space-y-1">
                  {docComponents.map((component) => (
                    <li key={component.title}>
                      <Link
                        href={component.href}
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
                Contact
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
