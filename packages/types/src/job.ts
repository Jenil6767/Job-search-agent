export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkplaceType = 'remote' | 'hybrid' | 'onsite';

export interface ISalaryRange {
  min?: number;
  max?: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface IJob {
  id: string;
  source: string;
  externalId: string;
  title: string;
  company: string;
  companyLogo?: string;
  description: string;
  summary?: string;
  location: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  experienceLevel?: string;
  minYearsExperience?: number;
  salary?: ISalaryRange;
  requiredSkills: string[];
  preferredSkills: string[];
  applicationUrl: string;
  postedAt: string | Date;
  expiresAt?: string | Date;
  embedding?: number[];
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IJobSearchParams {
  query?: string;
  location?: string;
  workplaceType?: WorkplaceType;
  employmentType?: EmploymentType;
  minSalary?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}
