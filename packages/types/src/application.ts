export type ApplicationStatus =
  | 'discovered'
  | 'shortlisted'
  | 'applied'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface IApplicationStatusHistory {
  status: ApplicationStatus;
  changedAt: string | Date;
  notes?: string;
}

export interface IApplication {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  statusHistory: IApplicationStatusHistory[];
  coverLetter?: string;
  applicationAnswers?: Record<string, string>;
  notes?: string;
  appliedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
