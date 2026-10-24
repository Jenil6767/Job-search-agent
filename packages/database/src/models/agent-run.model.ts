import mongoose, { Schema, Document } from 'mongoose';
import { IToolExecution } from '@ai-jobpilot/types';

export interface IAgentRunDocument extends Document {
  userId: string;
  userPrompt: string;
  finalResponse: string;
  toolExecutions: IToolExecution[];
  iterations: number;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
  createdAt: Date;
}

const ToolExecutionSchema = new Schema(
  {
    id: { type: String, required: true },
    toolName: { type: String, required: true },
    arguments: { type: Schema.Types.Mixed, default: {} },
    result: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ['pending', 'requires_approval', 'approved', 'rejected', 'completed', 'failed'],
      default: 'completed',
    },
    error: { type: String },
    executedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AgentRunSchema = new Schema<IAgentRunDocument>(
  {
    userId: { type: String, required: true, index: true },
    userPrompt: { type: String, required: true },
    finalResponse: { type: String, required: true },
    toolExecutions: [ToolExecutionSchema],
    iterations: { type: Number, default: 1 },
    tokensUsed: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AgentRunSchema.index({ userId: 1, createdAt: -1 });

export const AgentRunModel =
  mongoose.models.AgentRun || mongoose.model<IAgentRunDocument>('AgentRun', AgentRunSchema);
