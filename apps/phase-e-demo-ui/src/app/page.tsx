import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h2 className="text-lg font-semibold text-yellow-800">Phase E – Non-executing (demo only)</h2>
        <p className="text-yellow-700">Safety banner: Outputs are advisory/pending only. No action is executed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/demo" 
          className="p-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-sm border border-slate-600 hover:border-blue-400 transition-colors text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase bg-red-500 px-2 py-0.5 rounded">NEW</span>
            <h3 className="text-lg font-bold">Phase M Assistant Demo</h3>
          </div>
          <p className="text-sm text-slate-300">Enter intentional demo gateway (read-only)</p>
        </Link>

        <Link 
          href="/patient" 
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-bold mb-2">Patient Demo View</h3>
          <p className="text-sm text-gray-600">SL-07 Scheduling Proposal</p>
        </Link>

        <Link 
          href="/provider" 
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-bold mb-2">Provider Review Demo View</h3>
          <p className="text-sm text-gray-600">SL-08 Provider Review</p>
        </Link>

        <Link 
          href="/clinician" 
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
        >
          <h3 className="text-lg font-bold mb-2">Clinician Drafting Demo View</h3>
          <p className="text-sm text-gray-600">SL-04 Clinical Drafting</p>
        </Link>

        <Link 
          href="/pilot" 
          className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg shadow-sm border border-emerald-500 hover:border-emerald-300 transition-colors text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase bg-white/20 px-2 py-0.5 rounded">PILOT</span>
            <h3 className="text-lg font-bold">Pilot Clinical Experience</h3>
          </div>
          <p className="text-sm text-emerald-100">Guided end-to-end clinician workflow (demo)</p>
          <p className="text-xs text-emerald-200 mt-2">Enter Pilot Experience →</p>
        </Link>
      </div>
    </div>
  );
}
