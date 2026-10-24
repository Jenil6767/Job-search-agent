import { ICandidateSkills, IEducationItem, IExperienceItem, IProjectItem } from './profile.js';

export interface IParsedResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  headline?: string;
  summary?: string;
  yearsOfExperience?: number;
  skills: ICandidateSkills;
  experiences: IExperienceItem[];
  education: IEducationItem[];
  projects: IProjectItem[];
  certifications: string[];
  achievements?: string[];
}

export interface IResumeVersion {
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  rawText?: string;
  parsedData?: IParsedResumeData;
  embedding?: number[];
  createdAt: string | Date;
}

export interface IResume {
  id: string;
  userId: string;
  currentVersion: number;
  versions: IResumeVersion[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
