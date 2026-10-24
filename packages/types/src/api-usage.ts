export interface IApiUsage {
  id: string;
  /** The external API source name (e.g. 'jsearch') */
  source: string;
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Number of API requests made on this date for this source */
  requestCount: number;
  /** Timestamp of the last request */
  lastRequestAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
