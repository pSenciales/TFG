"use client"

import * as React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
    const { data: session } = useSession();

    return (
        <div className="bg-white flex  shadow-md sticky top-0 z-50 w-full">
            <div className="display flex items-center max-w-7xl w-full space-x-10 px-3 py-2 mx-5">

                <Link href="/" className="text-xl font-bold flex items-center space-x-2">
                    <img src="/logo-no-bg.png" alt="logo" className="h-10 w-10" />
                    Fairplay360
                </Link>
                
                {/* Menú de navegación */}
                <NavigationMenu>
                    <NavigationMenuList className="flex flex-col md:flex-row md:space-x-4">
                    <NavigationMenuItem>
                            <Link href="/docs" passHref legacyBehavior>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Denuncia
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Documentación</NavigationMenuTrigger>
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
                                    Contacto
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

            </div>

            <div className="flex justify-end items-center space-x-4 w-full mr-10">
                {session ? (
                    <Button onClick={() => signOut()}>Log Out</Button>
                ) : (
                    <div className="flex justify-end items-center space-x-4 w-full mr-10">
                    <Button variant="outline" onClick={() => window.location.href = '/login'}>Log In</Button>
                    <Button onClick={()=>window.location.href = '/signup'}>Sign up</Button>    
                    </div>
                )}
            </div>


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
