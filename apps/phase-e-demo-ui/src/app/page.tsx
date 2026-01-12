import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h2 className="text-lg font-semibold text-yellow-800">Phase E – Non-executing (demo only)</h2>
        <p className="text-yellow-700">Safety banner: Outputs are advisory/pending only. No action is executed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
