'use client';

import React from 'react';
import { FileText, UploadCloud } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary-light" />
          Resume Management & Vector RAG
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload PDF/DOCX resumes for structured extraction and semantic embeddings.
        </p>
      </div>

      <div className="rounded-2xl glass-panel p-12 text-center border-2 border-dashed border-border hover:border-primary/50 transition-colors space-y-4">
        <div className="mx-auto h-12 w-12 rounded-full bg-surface-elevated flex items-center justify-center text-primary-light">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Upload Resume (PDF, DOCX)</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          AI parsing pipeline and vector generation will be unlocked in Phase 2 & 4.
        </p>
      </div>
    </div>
  );
}
