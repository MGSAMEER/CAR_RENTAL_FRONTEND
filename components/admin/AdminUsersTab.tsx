'use client';

import { format } from 'date-fns';
import type { User } from '@/lib/types';
import { adminApi } from '@/lib/services';
import toast from 'react-hot-toast';

interface ExtUser extends User { isBlocked?: boolean; }
interface Props { users: ExtUser[]; setUsers: React.Dispatch<React.SetStateAction<ExtUser[]>>; }

export default function AdminUsersTab({ users, setUsers }: Props) {
  const handleBlock = async (user: ExtUser) => {
    try {
      if (user.isBlocked) {
        await adminApi.unblockUser(user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: false } : u));
        toast.success('User unblocked');
      } else {
        await adminApi.blockUser(user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: true } : u));
        toast.success('User blocked');
      }
    } catch { toast.error('Action failed'); }
  };

  return (
    <div className="animate-slide-up">
      <div className="mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} registered users</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {['User', 'Email', 'Role', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {users.map(u => (
                <tr key={u.id} id={`admin-user-row-${u.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      u.role === 'admin'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {u.createdAt ? format(new Date(u.createdAt), 'dd MMM yyyy') : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      u.isBlocked
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role !== 'admin' && (
                      <button
                        id={`admin-toggle-block-${u.id}`}
                        onClick={() => handleBlock(u)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all ${
                          u.isBlocked
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20'
                            : 'text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                        }`}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
