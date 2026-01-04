import React from 'react';
import { 
  ArrowUpRight, 
  MessageSquare, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Active Chats', value: '12', change: '+2', icon: MessageSquare },
    { name: 'Pending Tasks', value: '4', change: '-1', icon: Clock },
    { name: 'Completed Today', value: '28', change: '+5', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, &lt;USER_NAME&gt;</h1>
        <p className="text-gray-500">Here's what's happening across your AI-platform-monorepo-starter services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">AI Analysis Complete</p>
                  <p className="text-xs text-gray-500">The Sales Agent finished analyzing the Q4 report.</p>
                  <p className="text-[10px] text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left group">
              <span className="text-sm font-medium">New Chat</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </button>
            <button className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left group">
              <span className="text-sm font-medium">Create Project</span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
