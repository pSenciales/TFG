export interface BannedUser {
    email: string;
    created_at: {$date: number};
}

export interface BannedUsersResponse {
    users: BannedUser[];
    nextCursor: number | null;
}