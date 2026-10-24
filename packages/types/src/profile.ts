export interface IExperienceItem {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies: string[];
}

export interface IEducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface IProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface ICandidateSkills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  ai: string[];
  tools: string[];
}

export interface IJobPreference {
  preferredTitles: string[];
  preferredLocations: string[];
  workplaceType: 'remote' | 'hybrid' | 'onsite' | 'any';
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  noticePeriodDays?: number;
  preferredCompanies: string[];
  excludedCompanies: string[];
  keywords: string[];
}

export interface ICandidateProfile {
  id: string;
  userId: string;
  fullName: string;
  headline?: string;
  summary?: string;
  yearsOfExperience: number;
  currentRole?: string;
  experiences: IExperienceItem[];
  education: IEducationItem[];
  projects: IProjectItem[];
  skills: ICandidateSkills;
  certifications: string[];
  preferences: IJobPreference;
  createdAt: string | Date;
  updatedAt: string | Date;
}
