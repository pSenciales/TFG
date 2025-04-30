
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Swal from "sweetalert2"


interface DropdownProps {
    reportId: string;
    openPDF: () => void;
    onDelete: () => void;
    banUser: () => void;
    handleResolve: () => void;

}

export default function DropdownActions({ reportId, openPDF, onDelete, banUser, handleResolve }: DropdownProps) {
    return (


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
                <DropdownMenuLabel>{"Report #" + reportId.slice(0, 15)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={
                    () => {
                        openPDF();
                    }
                }>
                    <div className="flex justify-between items-center w-full">

                        <span> View</span>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                            <circle cx="12" cy="12" r="3.5" stroke="#000000"></circle>
                            <path d="M21 12C21 12 20 4 12 4C4 4 3 12 3 12" stroke="#000000"></path></svg>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleResolve()

                    }>
                    <div className="flex justify-between items-center w-full">

                        <span> Resolve </span>
                        <svg viewBox="0 0 24 24" width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000">
                            <path d="M12.0225923,2.99879075 C11.7257502,3.46221691 11.4861106,3.96580034 11.3136354,4.49957906 L5.25,4.5 
                                    C4.28350169,4.5 3.5,5.28350169 3.5,6.25 L3.5,14.75 C3.5,15.7164983 4.28350169,16.5 5.25,16.5 L7.49878573,16.5 L7.49985739,20.2505702 
                                    L12.5135149,16.5 L18.75,16.5 C19.7164983,16.5 20.5,15.7164983 20.5,14.75 L20.5010736,12.2672297 C21.0520148,11.9799518 21.5566422,11.6160435 
                                    22.0008195,11.1896412 L22,14.75 C22,16.5449254 20.5449254,18 18.75,18 L13.0124851,18 L7.99868152,21.7506795 C7.44585139,22.1641649 
                                    6.66249789,22.0512036 6.2490125,21.4983735 C6.08735764,21.2822409 6,21.0195912 6,20.7499063 L5.99921427,18 L5.25,18 C3.45507456,18 
                                    2,16.5449254 2,14.75 L2,6.25 C2,4.45507456 3.45507456,3 5.25,3 L12.0225923,2.99879075 Z M17.5,1 C20.5375661,1 23,3.46243388 23,6.5 
                                    C23,9.53756612 20.5375661,12 17.5,12 C14.4624339,12 12,9.53756612 12,6.5 C12,3.46243388 14.4624339,1 17.5,1 Z M20.1464558,4.14642633 
                                    L16.0541062,8.23877585 L14.9000091,6.69997972 C14.7343237,6.47906582 14.420923,6.4342943 14.2000091,6.59997972 C13.9790952,6.76566515 
                                    13.9343237,7.07906582 14.1000091,7.29997972 L15.6000091,9.29997972 C15.782574,9.54339946 16.1384079,9.5686878 16.3535625,9.35353311 
                                    L20.8535625,4.85353311 C21.0488247,4.65827097 21.0488247,4.34168848 20.8535625,4.14642633 C20.6583004,3.95116419 20.3417179,3.95116419 
                                    20.1464558,4.14642633 Z" id="🎨-Color">
                            </path>
                        </svg>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={async () => {
                        const confirmed = await Swal.fire({
                            title: "Are you sure?",
                            text: "This will delete the report permanently.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, delete it!",
                        });

                        if (confirmed.isConfirmed) {
                            onDelete();
                        }
                    }}
                >
                    <div className="flex justify-between items-center w-full">
                        <span>Delete</span>
                        <svg width="20" height="20" className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003">
                            <path d="M12 2.75C11.0215 2.75 10.1871 3.37503 9.87787 4.24993C9.73983 
                                4.64047 9.31134 4.84517 8.9208 4.70713C8.53026 4.56909 8.32557 4.1406 8.46361 
                                3.75007C8.97804 2.29459 10.3661 1.25 12 1.25C13.634 1.25 15.022 2.29459 
                                15.5365 3.75007C15.6745 4.1406 15.4698 4.56909 15.0793 4.70713C14.6887 
                                4.84517 14.2602 4.64047 14.1222 4.24993C13.813 3.37503 12.9785 2.75 12 2.75Z"
                                fill="#000000">
                            </path>
                            <path d="M2.75 6C2.75 5.58579 3.08579 5.25 3.5 5.25H20.5001C20.9143 5.25 21.2501 
                                    5.58579 21.2501 6C21.2501 6.41421 20.9143 6.75 20.5001 6.75H3.5C3.08579 6.75 2.75 6.41421 
                                    2.75 6Z" fill="#000000">
                            </path>
                            <path d="M5.91508 8.45011C5.88753 8.03681 5.53015 7.72411 5.11686 7.75166C4.70356 7.77921 
                                        4.39085 8.13659 4.41841 8.54989L4.88186 15.5016C4.96735 16.7844 5.03641 17.8205 5.19838 18.6336C5.36678 
                                        19.4789 5.6532 20.185 6.2448 20.7384C6.83639 21.2919 7.55994 21.5307 8.41459 21.6425C9.23663 21.75 10.2751 21.75 
                                        11.5607 21.75H12.4395C13.7251 21.75 14.7635 21.75 15.5856 21.6425C16.4402 21.5307 17.1638 21.2919 17.7554 
                                        20.7384C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9637 17.8205 19.0328 16.7844 19.1183 15.5016L19.5818 
                                        8.54989C19.6093 8.13659 19.2966 7.77921 18.8833 7.75166C18.47 7.72411 18.1126 8.03681 18.0851 8.45011L17.6251 
                                        15.3492C17.5353 16.6971 17.4712 17.6349 17.3307 18.3405C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 
                                        19.8988 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255
                                        20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8988 7.26957 19.6431C6.99616 19.3873 6.80583 19.025 6.66948 
                                        18.3405C6.52891 17.6349 6.46488 16.6971 6.37503 15.3492L5.91508 8.45011Z" fill="#000000">
                            </path>
                            <path d="M9.42546 10.2537C9.83762 10.2125 10.2051 10.5132 
                                            10.2464 10.9254L10.7464 15.9254C10.7876 16.3375 10.4869 16.7051 
                                            10.0747 16.7463C9.66256 16.7875 9.29502 16.4868 9.25381 16.0746L8.75381 
                                            11.0746C8.71259 10.6625 9.0133 10.2949 9.42546 10.2537Z" fill="#000000">
                            </path>
                            <path d="M15.2464 11.0746C15.2876 10.6625 14.9869 10.2949 14.5747 10.2537C14.1626 
                                                10.2125 13.795 10.5132 13.7538 10.9254L13.2538 15.9254C13.2126 16.3375 13.5133 16.7051
                                                13.9255 16.7463C14.3376 16.7875 14.7051 16.4868 14.7464 16.0746L15.2464 11.0746Z" fill="#000000">
                            </path>
                        </svg>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={async () => {
                        const confirmed = await Swal.fire({
                            title: "Are you sure?",
                            text: "This will ban every account related to this email.",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes!",
                        });
                        if (confirmed.isConfirmed) {

                            banUser()

                        }
                    }}


                >
                    <div className="flex justify-between items-center w-full">

                        <span>Ban user</span>
                        <svg width="20" height="20" fill="#ff0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000">
                            <path d="M16 1.25c-8.146 0-14.75 6.604-14.75 14.75s6.604 
                                        14.75 14.75 14.75c8.146 0 14.75-6.604 14.75-14.75v0c-0.010-8.142-6.608-14.74-14.749-14.75h-0.001zM29.25 
                                        16c-0 3.344-1.246 6.397-3.298 8.72l0.012-0.014-18.77-18.578c2.331-2.096 
                                        5.43-3.378 8.829-3.378 7.305 0 13.227 5.922 13.227 13.227 0 0.008 0 0.016-0 0.024v-0.001zM2.75 16c0.001-3.394 
                                        1.285-6.488 3.393-8.824l-0.010 0.012 18.78 18.588c-2.345 2.154-5.486 3.474-8.935 3.474-7.305 
                                        0-13.228-5.922-13.228-13.228 0-0.008 0-0.016 0-0.024v0.001z"></path>
                        </svg>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}