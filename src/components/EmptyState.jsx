import React from 'react';
import { FolderOpen } from 'lucide-react';

/**
 * Reusable EmptyState UI component for missing data, search results, or empty lists
 */
const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  description = 'There are no records available to display right now.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-2xs">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-[#0B2E8C] flex items-center justify-center mx-auto border border-slate-200">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center bg-[#0B2E8C] hover:bg-[#082269] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all cursor-pointer"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
