"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components = [
    { title: "Modelo de lenguaje", href: "*", description: "Usamos *" },
    { title: "OCR", href: "*", description: "La trascripción de imagen a texto con *" },
    { title: "Front-end", href: "*", description: "Next.js como tecnología de presentación" },
    { title: "Back-end", href: "*", description: "Fast-API como tecnología de *" },
    { title: "Arquitectura", href: "*", description: "Arquitectura en microservicios" },
    { title: "Base de datos", href: "*", description: "MongoDB como base de datos" },
]

export default function NavBar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="bg-white flex items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold">FairPlay 360</Link>

            {/* Botón de menú para dispositivos móviles */}
            <button 
                className="block md:hidden text-gray-600 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Icono de hamburguesa */}
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    ></path>
                </svg>
            </button>

            {/* Menú de navegación */}
            <NavigationMenu className={`flex-grow ${isOpen ? 'block' : 'hidden'} md:flex`}>
                <NavigationMenuList className="flex flex-col md:flex-row md:space-x-4">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Inicio</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/"
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                Motivación
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                Aplicación para la detección y denuncia de delitos de odio, enfocada para ser un referente en la lucha antirracista LaLiga.
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/*" title="Introducción">
                                    App **/ 
                                </ListItem>
                                <ListItem href="/*" title="Uso">
                                    Uso sin ánimo de lucro
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>¿Cómo funciona?</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {components.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/docs" passHref legacyBehavior>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Documentación
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Botón de "Inicia Sesión" */}
            <Link href="/login">
                <button className="ml-auto px-4 py-2 rounded-md hover:bg-gray-100 hidden md:block" style={{ fontSize: "80%" }}>
                    Inicia Sesión
                </button>
            </Link>
        </div>
    )
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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
    )
})
ListItem.displayName = "ListItem"
