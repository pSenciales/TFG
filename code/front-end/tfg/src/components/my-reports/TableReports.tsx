import DropdownActions from "@/components/my-reports/DropdownActions";
import TruncateText from "@/components/my-reports/TruncateText";
import FadeIn from "@/components/fadeIn";
import { Report } from "@/types/reports";



import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface TableReportsProps {
    allReports: Report[];
    openPDF: (report: Report) => void;
    banUser: (email: string) => void;
    handleResolve: (id: string, email: string) => void;
    deleteReportAndLog: (id: string) => void;
}

export default function TableReports({ allReports, openPDF, banUser, handleResolve, deleteReportAndLog }: TableReportsProps) {
    return (
        <FadeIn>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead className="text-center">Hate?</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allReports.map((report: Report) => (
                        <TableRow key={report._id.$oid}>
                            <TableCell>
                                {new Date(report.created_at.$date).toLocaleString()}
                            </TableCell>

                            <TableCell className="max-w-xs truncate">
                                <TruncateText
                                    text={report.content}
                                />
                            </TableCell>

                            <TableCell>
                                <a
                                    href={report.source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    See source
                                </a>
                            </TableCell>

                            <TableCell>{report.state.toUpperCase()}</TableCell>

                            <TableCell className="text-center">
                                {report.is_hate ? "Is hate" : "Not hate"}
                            </TableCell>

                            <TableCell className="text-right space-x-2 relative">
                                <DropdownActions
                                    reportId={report._id.$oid}
                                    onDelete={() => deleteReportAndLog(report._id.$oid)}
                                    openPDF={() => openPDF(report)}
                                    banUser={() => banUser(report.notification_email)}
                                    handleResolve={() => handleResolve(report._id.$oid, report.notification_email)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>
                            Total: {allReports.length} reports
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </FadeIn>
    )
}