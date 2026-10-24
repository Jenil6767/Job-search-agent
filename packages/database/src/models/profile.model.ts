import mongoose, { Schema, Document } from 'mongoose';
import { ICandidateProfile } from '@ai-jobpilot/types';

export interface ICandidateProfileDocument extends Omit<ICandidateProfile, 'id'>, Document {}

const ExperienceItemSchema = new Schema(
  {
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    technologies: [{ type: String }],
  },
  { _id: true }
);

const EducationItemSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String },
    grade: { type: String },
  },
  { _id: true }
);

const ProjectItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    link: { type: String },
    startDate: { type: String },
    endDate: { type: String },
  },
  { _id: true }
);

const CandidateProfileSchema = new Schema<ICandidateProfileDocument>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    headline: { type: String },
    summary: { type: String },
    yearsOfExperience: { type: Number, default: 0 },
    currentRole: { type: String },
    experiences: [ExperienceItemSchema],
    education: [EducationItemSchema],
    projects: [ProjectItemSchema],
    skills: {
      languages: [{ type: String, index: true }],
      frameworks: [{ type: String, index: true }],
      databases: [{ type: String }],
      cloud: [{ type: String }],
      ai: [{ type: String }],
      tools: [{ type: String }],
    },
    certifications: [{ type: String }],
    preferences: {
      preferredTitles: [{ type: String }],
      preferredLocations: [{ type: String }],
      workplaceType: {
        type: String,
        enum: ['remote', 'hybrid', 'onsite', 'any'],
        default: 'any',
      },
      minSalary: { type: Number },
      maxSalary: { type: Number },
      currency: { type: String, default: 'USD' },
      noticePeriodDays: { type: Number, default: 30 },
      preferredCompanies: [{ type: String }],
      excludedCompanies: [{ type: String }],
      keywords: [{ type: String }],
    },
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

export const CandidateProfileModel =
  mongoose.models.CandidateProfile ||
  mongoose.model<ICandidateProfileDocument>('CandidateProfile', CandidateProfileSchema);
