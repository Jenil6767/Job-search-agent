import axios, { AxiosInstance } from 'axios';
import { IJob, WorkplaceType, EmploymentType } from '@ai-jobpilot/types';
import { ApiUsageModel } from '@ai-jobpilot/database';
import { logger } from '../utils/logger.js';

// ----- JSearch API Response Types -----

interface JSearchSalary {
  min_salary?: number;
  max_salary?: number;
  salary_currency?: string;
  salary_period?: string;
}

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  job_description: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_is_remote: boolean;
  job_employment_type?: string;
  job_required_skills?: string[] | null;
  job_apply_link: string;
  job_posted_at_datetime_utc?: string;
  job_offer_expiration_datetime_utc?: string;
  job_min_salary?: number | null;
  job_max_salary?: number | null;
  job_salary_currency?: string | null;
  job_salary_period?: string | null;
  job_experience_in_place_of_education?: boolean;
  job_required_experience?: {
    required_experience_in_months?: number;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
    no_experience_required?: boolean;
  };
}

interface JSearchResponse {
  status: string;
  request_id: string;
  data: JSearchJob[];
}

// ----- Constants -----

const JSEARCH_SOURCE = 'jsearch';

// ----- Service -----

export class JSearchService {
  private client: AxiosInstance;
  private monthlyLimit: number;

  constructor() {
    const apiKey = process.env.RAPIDAPI_KEY || '';
    const host = process.env.JSEARCH_HOST || 'jsearch.p.rapidapi.com';
    this.monthlyLimit = Number(process.env.JSEARCH_MONTHLY_LIMIT) || 200;

    if (!apiKey) {
      logger.warn('[JSearchService] RAPIDAPI_KEY is not set — JSearch calls will fail');
    }

    this.client = axios.create({
      baseURL: `https://${host}`,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
      timeout: 15_000,
    });
  }

  // ---------- Rate Limiting ----------

  /**
   * Check if we are still under the monthly API usage limit.
   * Keeps a 10-request safety buffer (e.g. 190 of 200).
   */
  async checkRateLimit(): Promise<{ allowed: boolean; used: number; remaining: number }> {
    const monthKey = this.getCurrentMonthKey(); // e.g. "2026-10"

    const usageRecords = await ApiUsageModel.find({
      source: JSEARCH_SOURCE,
      date: { $regex: `^${monthKey}` }, // matches "2026-10-*"
    });

    const monthlyUsed = usageRecords.reduce((sum, r) => sum + r.requestCount, 0);
    const safeLimit = this.monthlyLimit - 10; // keep 10 as buffer
    const remaining = Math.max(0, safeLimit - monthlyUsed);

    return {
      allowed: monthlyUsed < safeLimit,
      used: monthlyUsed,
      remaining,
    };
  }

  /**
   * Atomically increment today's usage counter after a successful API call.
   */
  async recordUsage(): Promise<void> {
    const today = this.getTodayKey(); // e.g. "2026-10-20"

    await ApiUsageModel.findOneAndUpdate(
      { source: JSEARCH_SOURCE, date: today },
      {
        $inc: { requestCount: 1 },
        $set: { lastRequestAt: new Date() },
      },
      { upsert: true, new: true }
    );
  }

  // ---------- Job Search ----------

  /**
   * Search for jobs via the JSearch API.
   * Returns normalized IJob-compatible objects ready for MongoDB upsert.
   */
  async searchJobs(
    query: string,
    location?: string,
    page: number = 1
  ): Promise<{ jobs: Partial<IJob>[]; rawCount: number }> {
    // 1. Check rate limit
    const rateCheck = await this.checkRateLimit();
    if (!rateCheck.allowed) {
      logger.warn(
        `[JSearchService] Monthly rate limit reached (${rateCheck.used}/${this.monthlyLimit}). Skipping search.`
      );
      return { jobs: [], rawCount: 0 };
    }

    // 2. Call JSearch API
    logger.info(`[JSearchService] Searching: query="${query}", location="${location || 'any'}", page=${page}`);

    try {
      const response = await this.client.get<JSearchResponse>('/search', {
        params: {
          query: location ? `${query} in ${location}` : query,
          page: String(page),
          num_pages: '1',
          date_posted: 'today',
        },
      });

      // 3. Record usage
      await this.recordUsage();

      const rawJobs = response.data?.data || [];
      logger.info(`[JSearchService] Received ${rawJobs.length} jobs from JSearch`);

      // 4. Normalize
      const jobs = rawJobs.map((raw) => this.normalizeJob(raw));

      return { jobs, rawCount: rawJobs.length };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        logger.error(
          `[JSearchService] API error: ${error.response?.status} — ${error.response?.statusText || error.message}`
        );
      } else {
        logger.error(`[JSearchService] Unexpected error: ${(error as Error).message}`);
      }
      throw error;
    }
  }

  // ---------- Normalization ----------

  /**
   * Maps a raw JSearch API job object to our IJob interface.
   */
  normalizeJob(raw: JSearchJob): Partial<IJob> {
    return {
      source: JSEARCH_SOURCE,
      externalId: raw.job_id,
      title: raw.job_title,
      company: raw.employer_name,
      companyLogo: raw.employer_logo || undefined,
      description: raw.job_description,
      location: this.buildLocation(raw),
      workplaceType: this.mapWorkplaceType(raw.job_is_remote),
      employmentType: this.mapEmploymentType(raw.job_employment_type),
      experienceLevel: this.mapExperienceLevel(raw.job_required_experience),
      minYearsExperience: raw.job_required_experience?.required_experience_in_months
        ? Math.round(raw.job_required_experience.required_experience_in_months / 12)
        : 0,
      salary: this.buildSalary(raw),
      requiredSkills: raw.job_required_skills || [],
      preferredSkills: [],
      applicationUrl: raw.job_apply_link,
      postedAt: raw.job_posted_at_datetime_utc
        ? new Date(raw.job_posted_at_datetime_utc)
        : new Date(),
      expiresAt: raw.job_offer_expiration_datetime_utc
        ? new Date(raw.job_offer_expiration_datetime_utc)
        : undefined,
      isActive: true,
    };
  }

  // ---------- Private Helpers ----------

  private buildLocation(raw: JSearchJob): string {
    const parts = [raw.job_city, raw.job_state, raw.job_country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  }

  private mapWorkplaceType(isRemote: boolean): WorkplaceType {
    return isRemote ? 'remote' : 'onsite';
  }

  private mapEmploymentType(type?: string): EmploymentType {
    if (!type) return 'full-time';

    const normalized = type.toUpperCase();
    const mapping: Record<string, EmploymentType> = {
      FULLTIME: 'full-time',
      'FULL-TIME': 'full-time',
      'FULL_TIME': 'full-time',
      PARTTIME: 'part-time',
      'PART-TIME': 'part-time',
      'PART_TIME': 'part-time',
      CONTRACTOR: 'contract',
      CONTRACT: 'contract',
      INTERN: 'internship',
      INTERNSHIP: 'internship',
      FREELANCE: 'freelance',
    };

    return mapping[normalized] || 'full-time';
  }

  private mapExperienceLevel(
    exp?: JSearchJob['job_required_experience']
  ): string {
    if (!exp) return 'Not specified';
    if (exp.no_experience_required) return 'Entry level';

    const months = exp.required_experience_in_months || 0;
    if (months <= 12) return 'Junior';
    if (months <= 36) return 'Mid-level';
    if (months <= 72) return 'Senior';
    return 'Lead / Staff';
  }

  private buildSalary(raw: JSearchJob): IJob['salary'] | undefined {
    if (!raw.job_min_salary && !raw.job_max_salary) return undefined;

    const periodMap: Record<string, 'yearly' | 'monthly' | 'hourly'> = {
      YEAR: 'yearly',
      MONTH: 'monthly',
      HOUR: 'hourly',
    };

    return {
      min: raw.job_min_salary || undefined,
      max: raw.job_max_salary || undefined,
      currency: raw.job_salary_currency || 'USD',
      period: periodMap[(raw.job_salary_period || 'YEAR').toUpperCase()] || 'yearly',
    };
  }

  private getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private getTodayKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  // ---------- Usage Stats (for admin endpoint) ----------

  async getUsageStats(): Promise<{ month: string; used: number; limit: number; remaining: number }> {
    const rateCheck = await this.checkRateLimit();
    return {
      month: this.getCurrentMonthKey(),
      used: rateCheck.used,
      limit: this.monthlyLimit,
      remaining: rateCheck.remaining,
    };
  }
}
