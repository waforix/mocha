import { Library } from "../../conversion";

export type APIThreadMetadata = {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: Date;
    locked: boolean;
    invitable?: boolean;
    create_timestamp?: Date | null;
}

export type ThreadMetadata = Library<APIThreadMetadata>;