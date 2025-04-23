interface ReportFile{
    _id: string;
    url: string;
}
export interface Report {
    _id: {$oid: string};
    content: string;
    context: string;
    state: string;
    source: string;
    is_hate: boolean;
    created_at: {$date: number};
    user_id: string;
    notification_email: string;
    images: ReportFile[];
    pdf: ReportFile[];
}


export interface ReportsResponse {
    reports: Report[];
    nextCursor: number | null;
  }

export interface Filters {
    email: string;
    provider: string;
    filterEmail: string;
    sortBy: string;
    includeHate: boolean;
    includeNotHate: boolean;
    statuses: string[];
  };