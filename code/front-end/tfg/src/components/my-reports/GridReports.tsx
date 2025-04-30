
import FadeIn from "@/components/fadeIn";
import ReportAdminCard from "@/components/my-reports/ReportAdminCard";
import { Report } from "@/types/reports";



interface GridReportsProps {
    allReports: Report[];
    openPDF: (report: Report) => void;
    banUser: (email: string) => void;
    handleResolve: (id: string, email: string) => void;
    deleteReportAndLog: (id: string) => void;
}


export default function GridReports({ allReports, openPDF, banUser, handleResolve, deleteReportAndLog }: GridReportsProps) {

    return (
        <FadeIn >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {allReports.map((report: Report) => (
                    <ReportAdminCard
                        report={report}
                        onDelete={() => deleteReportAndLog(report._id.$oid)}
                        openPDF={() => openPDF(report)}
                        banUser={() => banUser(report.notification_email)}
                        handleResolve={() => handleResolve(report._id.$oid, report.notification_email)}
                    />
                ))}
            </div>
        </FadeIn>
    )

}
