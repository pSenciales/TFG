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
    return (
        <div className="mt-4 md:mt-0">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">Sort and filter</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Sort and filter the reports</h4>
                            <p className="text-sm text-muted-foreground">
                                Select the sorting method
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
                                    <SelectItem value="date_desc">Date ↓</SelectItem>
                                    <SelectItem value="date_asc">Date ↑</SelectItem>
                                    <SelectItem value="content_desc">Content A‑Z</SelectItem>
                                    <SelectItem value="content_asc">Content Z‑A</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 mt-5 justify-items-center items-start">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Hate detected?
                            </p>
                            <div className="flex flex-col">
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={isHateCheckBox} onCheckedChange={() => toggleCheckbox(isHateCheckBox, [notHateCheckBox], setIsHateCheckBox)} />
                                    <Label className="ml-2">Is Hate</Label>
                                </div>
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={notHateCheckBox} onCheckedChange={() => toggleCheckbox(notHateCheckBox, [isHateCheckBox], setNotHateCheckBox)} />
                                    <Label className="ml-2">Not Hate</Label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>
                            <div className="flex flex-col">
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={processingCheckBox} onCheckedChange={() => toggleCheckbox(processingCheckBox, [acceptedCheckBox, rejectedCheckBox], setProcessingCheckBox)} />
                                    <Label className="ml-2">Processing</Label>
                                </div>
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={acceptedCheckBox} onCheckedChange={() => toggleCheckbox(acceptedCheckBox, [processingCheckBox, rejectedCheckBox], setAcceptedCheckBox)} />
                                    <Label className="ml-2">Accepted</Label>
                                </div>
                                <div className="flex mt-1 place-items-center">
                                    <Checkbox checked={rejectedCheckBox} onCheckedChange={() => toggleCheckbox(rejectedCheckBox, [acceptedCheckBox, processingCheckBox], setRejectedCheckBox)} />
                                    <Label className="ml-2">Rejected</Label>
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

                            {`0 Filters applied`}
                        </span>
                    )
                    :
                    (
                        <span
                            className={`ml-2 text-white text-xs font-semibold py-1 px-2 rounded-full  bg-red-500`}
                        >
                            {filtersCount === 1 
                                ? "1 filter applied"
                                : `${filtersCount} filters applied`
                            }
                            
                        </span>
                    )
            }
        </div>
    )
}