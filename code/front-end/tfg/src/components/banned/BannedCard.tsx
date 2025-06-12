"use client";
import { BannedUser } from "@/types/banned";
import { useTranslations } from "next-intl";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Swal from "sweetalert2";

interface ReportCardProps {
    user: BannedUser;
    restoreAccess: () => void;
}

export default function BannedCard({ user, restoreAccess }: ReportCardProps) {
    const t = useTranslations("admin.bannedusers");


    const dateString = new Date(user.created_at.$date).toLocaleString();
    const userEmail = user.email;

    return (
        <div className="p-4 border rounded shadow">
            <p className="font-medium">{userEmail}</p>
            <p className="text-sm text-gray-500">
                {t('banneddate') + " " +dateString}
            </p>


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
                    <DropdownMenuLabel>
                        {userEmail.slice(0, 20) + (userEmail.length > 20 ? "..." : "")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={async () => {
                            const confirmed = await Swal.fire({
                                title: t('restore.alert.title'),
                                text: t('restore.alert.text'),
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: t('restore.alert.buttonaccept'),
                                cancelButtonText: t('restore.alert.buttoncancel')
                            });
                            if (confirmed.isConfirmed) {

                                restoreAccess();

                            }
                        }}
                    >
                        <div className="flex justify-between items-center w-full">

                            <span>{t('restore.title')}</span>
                            <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.88468 17C7.32466 19.1128 9.75033 20.5 12.5 20.5C16.9183 20.5 
                            20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5C8.08172 4.5 4.5 
                            8.08172 4.5 12.5V13.5M12.5 8V12.5L15.5 15.5" stroke="#121923" strokeWidth="1.2">
                                </path>
                                <path d="M7 11L4.5 13.5L2 11" stroke="#121923" strokeWidth="1.2">
                                </path>
                            </svg>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>




        </div>

    );
}
