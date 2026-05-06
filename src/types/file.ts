export enum FileStatus {
  ATTACHED = "ATTACHED",
  PENDING = "PENDING",
}

export enum FileCategory {
  STICKER = "STICKER",
}

export interface File {
  id: string;
  path: string;
  status: FileStatus;
  category: FileCategory;
}
