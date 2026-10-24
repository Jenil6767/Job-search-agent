import mongoose, { Schema, Document } from 'mongoose';
import { IJob, WorkplaceType, EmploymentType } from '@ai-jobpilot/types';

export interface IJobDocument extends Omit<IJob, 'id'>, Document {}

const JobSchema = new Schema<IJobDocument>(
  {
    source: {
      type: String,
      required: true,
      index: true,
    },
    externalId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      index: true,
    },
    companyLogo: { type: String },
    description: {
      type: String,
      required: true,
    },
    summary: { type: String },
    location: {
      type: String,
      required: true,
      index: true,
    },
    workplaceType: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
      required: true,
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      required: true,
    },
    experienceLevel: { type: String },
    minYearsExperience: { type: Number, default: 0 },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
      period: { type: String, enum: ['yearly', 'monthly', 'hourly'], default: 'yearly' },
    },
    requiredSkills: [{ type: String, index: true }],
    preferredSkills: [{ type: String }],
    applicationUrl: { type: String, required: true },
    postedAt: { type: Date, required: true, index: true },
    expiresAt: { type: Date },
    embedding: [{ type: Number }],
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound Indexes for high performance querying and deduplication
JobSchema.index({ source: 1, externalId: 1 }, { unique: true });
JobSchema.index({ isActive: 1, postedAt: -1 });
JobSchema.index({ workplaceType: 1, postedAt: -1 });

export const JobModel = mongoose.models.Job || mongoose.model<IJobDocument>('Job', JobSchema);
