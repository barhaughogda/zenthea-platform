import React from 'react';

interface BannersProps {
  slice: string;
}

export function Banners({ slice }: BannersProps) {
  return (
    <div className="space-y-2 mb-6">
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
