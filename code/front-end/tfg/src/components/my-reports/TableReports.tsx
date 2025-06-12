import DropdownActions from "@/components/my-reports/DropdownActions";
import TruncateText from "@/components/my-reports/TruncateText";
import FadeIn from "@/components/fadeIn";
import { Report } from "@/types/reports";
import { useTranslations } from "next-intl";


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
    const t = useTranslations("admin.report.table");
    const processStatus = (status: string): string => {
        return status === "processing" ? t('status.processing') :
               status === "accepted" ? t('status.accepted') : t('status.rejected');
    }
    return (
        <FadeIn>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('date')}</TableHead>
                        <TableHead>{t('user')}</TableHead>
                        <TableHead>{t('content')}</TableHead>
                        <TableHead>{t('source')}</TableHead>
                        <TableHead>{t('status.title')}</TableHead>
                        <TableHead className="text-center">{t('hate.title')}</TableHead>
                        <TableHead className="text-right">{t('actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allReports.map((report: Report) => (
                        <TableRow key={report._id.$oid}>
                            <TableCell>
                                {new Date(report.created_at.$date).toLocaleString()}
                            </TableCell>
                            <TableCell>
                                {report.notification_email}
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
                                    {t('seesource')}
                                </a>
                            </TableCell>

                            <TableCell>{processStatus(report.state).toUpperCase()}</TableCell>

                            <TableCell className="text-center">
                                {report.is_hate ? t('hate.true') : t('hate.false')}
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
                            Total: {allReports.length} {t('reports')}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </FadeIn>
    )
}