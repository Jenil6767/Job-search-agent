import mongoose, { Schema, Document } from 'mongoose';
import { IApiUsage } from '@ai-jobpilot/types';

export interface IApiUsageDocument extends Omit<IApiUsage, 'id'>, Document {}

const ApiUsageSchema = new Schema<IApiUsageDocument>(
  {
    source: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    requestCount: {
      type: Number,
      required: true,
      default: 0,
    },
    lastRequestAt: {
      type: Date,
      required: true,
      default: Date.now,
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

// Compound index for dedup: one record per source per day
ApiUsageSchema.index({ source: 1, date: 1 }, { unique: true });

export const ApiUsageModel =
  mongoose.models.ApiUsage || mongoose.model<IApiUsageDocument>('ApiUsage', ApiUsageSchema);
