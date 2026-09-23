import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface ResearchProgressProps {
  topic: string;
}

const STEPS = [
  'Understanding your topic',
  'Finding related keywords',
  'Grouping keyword themes',
  'Discovering niche angles',
  'Analyzing competitors',
  'Identifying market gaps',
  'Generating opportunity report'
];

export const ResearchProgress: React.FC<ResearchProgressProps> = ({ topic }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Progressively advance through steps over ~4-5 seconds
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="research-progress-modal" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg mx-auto shadow-lg text-center my-8">
      <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 mb-1">
        Researching &ldquo;{topic}&rdquo;...
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Querying live Amazon suggestions and analyzing market positioning
      </p>

      <div className="space-y-2.5 text-left max-w-sm mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs sm:text-sm font-medium transition-colors ${
                isDone
                  ? 'text-emerald-700'
                  : isCurrent
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 shrink-0" />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
        Results are analytical indicators to validate before publishing.
      </div>
    </div>
  );
};
