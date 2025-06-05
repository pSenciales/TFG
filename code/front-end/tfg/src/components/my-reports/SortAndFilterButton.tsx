import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useTranslations } from "next-intl";

interface SortAndFilterButtonProps {
    sortBy: string;
    setSortBy: Dispatch<SetStateAction<string>>;
    toggleCheckbox: (current: boolean, others: boolean[], setCurrent: React.Dispatch<React.SetStateAction<boolean>>) => void;
    isHateCheckBox: boolean;
    setIsHateCheckBox: Dispatch<SetStateAction<boolean>>;
    notHateCheckBox: boolean;
    setNotHateCheckBox: Dispatch<SetStateAction<boolean>>;
    processingCheckBox: boolean;
    setProcessingCheckBox: Dispatch<SetStateAction<boolean>>;
    acceptedCheckBox: boolean;
    setAcceptedCheckBox: Dispatch<SetStateAction<boolean>>;
    rejectedCheckBox: boolean;
    setRejectedCheckBox: Dispatch<SetStateAction<boolean>>;
    applyFilters: () => void;
    filtersCount: number;
}


export default function SortAndFilterButton(
    {
        sortBy,
        setSortBy,
        toggleCheckbox,
        isHateCheckBox,
        setIsHateCheckBox,
        notHateCheckBox,
        setNotHateCheckBox,
        processingCheckBox,
        setProcessingCheckBox,
        acceptedCheckBox,
        setAcceptedCheckBox,
        rejectedCheckBox,
        setRejectedCheckBox,
        applyFilters,
        filtersCount
    }: SortAndFilterButtonProps) {

    const t = useTranslations("myreports.sortandfilter");

    return (
        <div className="mt-4 md:mt-0">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">{t('buttontext')}</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">{t('title')}</h4>
                            <p className="text-sm text-muted-foreground">
                                {t('select.title')}
                            </p>
                        </div>
                    </div>
                    <div className="mt-2">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by…" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="date_desc">{t('select.options.date')} ↓</SelectItem>
                                    <SelectItem value="date_asc">{t('select.options.date')} ↑</SelectItem>
                                    <SelectItem value="content_asc">{t('select.options.content')} A‑Z</SelectItem>
                                    <SelectItem value="content_desc">{t('select.options.content')} Z‑A</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 mt-5 justify-items-center items-start">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t('filter.hate.title')}
                            </p>
                            <div className="flex flex-col">
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={isHateCheckBox} onCheckedChange={() => toggleCheckbox(isHateCheckBox, [notHateCheckBox], setIsHateCheckBox)} />
                                    <Label className="ml-2">{t('filter.hate.options.true')}</Label>
                                </div>
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={notHateCheckBox} onCheckedChange={() => toggleCheckbox(notHateCheckBox, [isHateCheckBox], setNotHateCheckBox)} />
                                    <Label className="ml-2">{t('filter.hate.options.false')}</Label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {t('filter.status.title')}
                            </p>
                            <div className="flex flex-col">
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={processingCheckBox} onCheckedChange={() => toggleCheckbox(processingCheckBox, [acceptedCheckBox, rejectedCheckBox], setProcessingCheckBox)} />
                                    <Label className="ml-2">{t('filter.status.options.processing')}</Label>
                                </div>
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={acceptedCheckBox} onCheckedChange={() => toggleCheckbox(acceptedCheckBox, [processingCheckBox, rejectedCheckBox], setAcceptedCheckBox)} />
                                    <Label className="ml-2">{t('filter.status.options.accepted')}</Label>
                                </div>
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={rejectedCheckBox} onCheckedChange={() => toggleCheckbox(rejectedCheckBox, [acceptedCheckBox, processingCheckBox], setRejectedCheckBox)} />
                                    <Label className="ml-2">{t('filter.status.options.rejected')}</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="mt-5 w-full"
                        onClick={applyFilters}
                    >Apply</Button>
                </PopoverContent>
            </Popover>
            {
                filtersCount < 1 ?
                    (
                        <span
                            className={`ml-2 text-white text-xs font-semibold py-1 px-2 rounded-full bg-gray-400`}
                        >

                            {`0 ${t('filter.filtersapplied')}`}
                        </span>
                    )
                    :
                    (
                        <span
                            className={`ml-2 text-white text-xs font-semibold py-1 px-2 rounded-full  bg-red-500`}
                        >
                            {filtersCount === 1 
                                ? "1 " + t('filter.filterapplied')
                                : `${filtersCount}  ${t('filter.filtersapplied')}`
                            }
                            
                        </span>
                    )
            }
        </div>
    )
}