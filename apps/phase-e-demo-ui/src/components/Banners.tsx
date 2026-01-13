import React from 'react';
import { SHADOW_MODE } from '@/lib/shadowMode';

interface BannersProps {
  slice: string;
}

export function Banners({ slice }: BannersProps) {
  return (
    <div className="space-y-2 mb-6">
      {SHADOW_MODE && (
        <div className="bg-amber-500 text-black px-4 py-2 rounded text-sm font-bold flex items-center justify-between" title="This assistant is viewing live data in read-only preview mode. No actions are possible.">
          <span>SHADOW MODE · READ-ONLY · LIVE DATA PREVIEW</span>
          <span className="text-xs font-normal underline cursor-help">Read-only preview mode. No actions possible.</span>
        </div>
      )}
      <div className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">
        Phase E – Non-executing (demo only)
      </div>
      <div className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold">
        {slice} – SEALED
      </div>
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-2 text-sm">
        Safety banner: Outputs are advisory/pending only. No action is executed.
      </div>
      <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 px-4 py-2 text-sm italic">
        Rendering rule: Outputs are rendered verbatim (no interpretation).
      </div>
    </div>
  );
}
