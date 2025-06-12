// app/profile/page.tsx
"use client";

import React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FadeIn from "@/components/fadeIn";
import axios from "axios";
import { signOut } from "next-auth/react";

import { useTranslations } from "next-intl";


function getInitials(name: string): string {
    const words = name.split(" ").filter(Boolean);
    return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function ProfilePage() {

    const t = useTranslations('profile');

    const { data: session, status } = useSession();
    const [confirmation, setConfirmation] = useState("");

    if (status === "loading") {
        return <div className="flex justify-center items-center h-screen">{t('loading')}</div>;
    }
    if (!session) {
        if (typeof window !== "undefined") window.location.href = "/auth/login";
        return null;
    }

    const { user, provider } = session;
    const name = user.name ?? "No Name";
    const email = user.email ?? "No Email";

    async function deleteUser() {
        const res = await axios.post("/api/proxy",{
            url: `${process.env.NEXT_PUBLIC_FLASK_API_URL}/users/${session?.user.id}`,
            method: "DELETE"
        })

        if (res.status === 200) {
            signOut();
        } else {
            console.error("Error deleting user:", res.data);
        }
    }

    return (
        <main className="flex items-center justify-center p-6">
            <FadeIn>
                <h1 className="text-center text-3xl font-bold my-10">{t('title')}</h1>
                <Card className="w-full mx-auto max-w-sm shadow-xl rounded-xl">
                    <CardHeader className="flex flex-col items-center pt-6">
                        <Avatar className="w-24 h-24 ring-2 ring-primary ring-offset-2">
                            {user.image ? (
                                <AvatarImage src={user.image} alt={name} />
                            ) : (
                                <AvatarFallback className="bg-black text-white text-3xl">
                                    {getInitials(name)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <CardTitle className="mt-4 text-xl font-semibold">{name}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            {email}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-4">
                        <div className="flex gap-2">
                            <span className="text-sm text-muted-foreground">{t('provider.title')}</span>
                            <span className="text-sm font-medium capitalize">{provider === "Credentials" ? t('provider.credentials') : provider}</span>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0">

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full" variant="destructive" >
                                    {t('delete.title').toUpperCase()}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>{t('delete.description').toUpperCase()}</DialogTitle>
                                    <DialogDescription>
                                        {t('delete.confirmation.write')} &apos;{t('delete.confirmation.keyword').toUpperCase()}&apos; {t('delete.confirmation.description')}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="text" className="text-right">
                                            {t('delete.label')}
                                        </Label>
                                        <Input id="confirmation" className="col-span-3" onChange={(e) => setConfirmation(e.target.value)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant={"destructive"}
                                        disabled={confirmation !== t('delete.confirmation.keyword').toUpperCase()}
                                        onClick={()=> {deleteUser()}}
                                    >
                                        {t('delete.button')}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                    </CardFooter>
                </Card>
            </FadeIn>
        </main>
    );
}
