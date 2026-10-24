import mongoose, { Schema, Document } from 'mongoose';
import { IWorkflow, WorkflowTriggerType } from '@ai-jobpilot/types';

export interface IWorkflowDocument extends Omit<IWorkflow, 'id'>, Document {}

const WorkflowNodeSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    label: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const WorkflowEdgeSchema = new Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    sourceHandle: { type: String },
    targetHandle: { type: String },
    label: { type: String },
  },
  { _id: false }
);

const WorkflowSchema = new Schema<IWorkflowDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String },
    triggerType: {
      type: String,
      enum: ['schedule', 'manual', 'webhook', 'new_job_detected'],
      default: 'manual',
    },
    schedule: {
      cronExpression: { type: String },
      timezone: { type: String, default: 'UTC' },
      enabled: { type: Boolean, default: false },
    },
    nodes: [WorkflowNodeSchema],
    edges: [WorkflowEdgeSchema],
    isEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastRunAt: { type: Date },
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

WorkflowSchema.index({ userId: 1, isEnabled: 1 });

export const WorkflowModel =
  mongoose.models.Workflow || mongoose.model<IWorkflowDocument>('Workflow', WorkflowSchema);
