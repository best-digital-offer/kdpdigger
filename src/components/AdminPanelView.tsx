import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  BarChart3,
  DollarSign,
  Activity,
  Settings,
  Sparkles,
  Database,
  RefreshCw,
  Plus,
  Coins,
  Check,
  AlertCircle
} from 'lucide-react';
import { User, AdminStats, UsageLog, SystemSettings } from '../types.ts';

interface AdminPanelViewProps {
  currentUser: User;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({ currentUser }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'users' | 'logs' | 'settings'>('overview');
  const [loading, setLoading] = useState(false);
  const [creditAdjustment, setCreditAdjustment] = useState<{ userId: string; credits: number }>({ userId: '', credits: 10 });
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-user-id': currentUser.id };
      const [resStats, resUsers, resLogs, resSettings] = await Promise.all([
        fetch('/api/admin/stats', { headers }).then(r => r.json()),
        fetch('/api/admin/users', { headers }).then(r => r.json()),
        fetch('/api/admin/usage', { headers }).then(r => r.json()),
        fetch('/api/admin/settings', { headers }).then(r => r.json())
      ]);

      if (resStats.stats) setStats(resStats.stats);
      if (resUsers.users) setUsers(resUsers.users);
      if (resLogs.logs) setLogs(resLogs.logs);
      if (resSettings.settings) setSettings(resSettings.settings);
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateCredits = async (userId: string, newCredits: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify({ credits: newCredits })
      });
      if (res.ok) {
        setStatusMsg('User credits updated successfully.');
        setTimeout(() => setStatusMsg(null), 2500);
        fetchAdminData();
      }
    } catch {
      alert('Failed to update credits');
    }
  };

  const handleToggleSetting = async (key: keyof SystemSettings) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': currentUser.id },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setSettings(updated);
        setStatusMsg('Settings saved.');
        setTimeout(() => setStatusMsg(null), 2500);
      }
    } catch {
      alert('Failed to save settings');
    }
  };

  return (
    <div id="admin-panel-page" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>KDP Digger &middot; Platform Administration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Admin Management Console
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Monitor real-time research volumes, AI usage tokens, user credit allocations, and system health.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Stats', icon: BarChart3 },
          { id: 'users', label: `Users & Credits (${users.length})`, icon: Users },
          { id: 'logs', label: `Live Usage Logs (${logs.length})`, icon: Activity },
          { id: 'settings', label: 'Engine Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Stats */}
      {activeSubTab === 'overview' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Total Users</span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{stats.totalUsers}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">{stats.activeUsers} active this week</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Research Requests</span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-600" />
                <span>{stats.totalResearchRequests}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Full analytical reports</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">AI Engine Calls</span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>{stats.totalAiRequests}</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">gemini-3.8-flash active</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Micro-SaaS Revenue</span>
              <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>${stats.totalRevenue.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">$1 - $3 tier volume</span>
            </div>
          </div>

          {/* Top Queried Topics */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              <span>Top Queried Niches on Platform</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {stats.topQueriedNiches.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 truncate">{item.topic}</span>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.count} searches
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeSubTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Registered Platform Users</h3>
            <span className="text-xs text-slate-500">{users.length} total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Credits</th>
                  <th className="p-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-black text-amber-700">{u.credits}</td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleUpdateCredits(u.id, u.credits + 10)}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded font-semibold text-[11px]"
                      >
                        +10 Credits
                      </button>
                      <button
                        onClick={() => handleUpdateCredits(u.id, Math.max(0, u.credits - 5))}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                      >
                        -5
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Usage Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Audit & Security Log</h3>
          </div>
          <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto text-xs">
            {logs.map((log) => (
              <li key={log.id} className="p-3 hover:bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900">{log.userEmail}</span>
                  <span className="text-slate-400 mx-1.5">&bull;</span>
                  <span className="text-slate-600">Searched: &ldquo;{log.query}&rdquo;</span>
                </div>
                <div className="text-[11px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Engine Settings */}
      {activeSubTab === 'settings' && settings && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Engine System Settings</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Amazon Autocomplete Index</strong>
                <span className="text-xs text-slate-500">Live query integration with real shopper suggestions</span>
              </div>
              <button
                onClick={() => handleToggleSetting('amazonDataProviderEnabled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.amazonDataProviderEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.amazonDataProviderEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Gemini 3.8 Flash Analysis Engine</strong>
                <span className="text-xs text-slate-500">Multi-stage topic narrowing and positioning gap synthesis</span>
              </div>
              <button
                onClick={() => handleToggleSetting('geminiEnabled')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.geminiEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.geminiEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Simulated Payment Checkout</strong>
                <span className="text-xs text-slate-500">Instant credit activation for testing $1-$3 micro-plans</span>
              </div>
              <button
                onClick={() => handleToggleSetting('simulationMode')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.simulationMode
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.simulationMode ? 'Simulation Active' : 'Live Stripe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
