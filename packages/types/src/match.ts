export interface IMatchBreakdown {
  skillsScore: number;
  experienceScore: number;
  locationScore: number;
  roleScore: number;
  semanticScore: number;
}

export interface IJobMatch {
  id: string;
  userId: string;
  jobId: string;
  matchScore: number;
  breakdown: IMatchBreakdown;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  gaps: string[];
  explanation: string;
  recommendation: 'strong_match' | 'moderate_match' | 'weak_match' | 'not_recommended';
  createdAt: string | Date;
  updatedAt: string | Date;
}
