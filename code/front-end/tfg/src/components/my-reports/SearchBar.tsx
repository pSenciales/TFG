'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface SearchBarProps {
    filterEmail: string;
    setFilterEmail: React.Dispatch<React.SetStateAction<string>>;
    applyFilters?: () => void;
}


export default function SearchBar({
    filterEmail,
    setFilterEmail,
    applyFilters
}: SearchBarProps) {
    const t = useTranslations();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (applyFilters) {
            applyFilters(); 
        }
    };

    return (
        <form className="flex-1 md:flex-none" onSubmit={handleSubmit}>
            <Label><p>{t('admin.report.searchbar.searchbyemail')}</p></Label>
            <div className="relative w-full mt-1">
                <Input
                    value={filterEmail}
                    type="text"
                    className="w-full pr-10 pl-3 py-1 border rounded-md"
                    placeholder= {t('admin.report.searchbar.placeholder')}
                    onChange={(e) => { setFilterEmail(e.target.value) }}
                />
                <button
                    type="submit" // Change to "submit" to allow Enter key to trigger the form
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Search"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                        />
                    </svg>
                </button>
            </div>
        </form>
    );
}