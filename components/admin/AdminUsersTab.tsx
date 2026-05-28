'use client';

import { format } from 'date-fns';
import type { User } from '@/lib/types';
import { adminApi } from '@/lib/services';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface ExtUser extends User { isBlocked?: boolean; }
interface Props { users: ExtUser[]; setUsers: React.Dispatch<React.SetStateAction<ExtUser[]>>; }

function MobileUserCard({ user, onBlock }: { user: ExtUser; onBlock: (user: ExtUser) => void }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{user.email}</p>
          </div>
        </div>
        <Badge variant={user.role === 'admin' ? 'info' : 'default'} size="sm" className="capitalize">
          {user.role}
        </Badge>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <Badge variant={user.isBlocked ? 'unavailable' : 'available'} size="sm">
          {user.isBlocked ? 'Blocked' : 'Active'}
        </Badge>
        <div className="flex items-center gap-2">
          {user.createdAt && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Joined: {format(new Date(user.createdAt), 'dd MMM yyyy')}
            </span>
          )}
          {user.role !== 'admin' && (
            <Button id={`mobile-toggle-block-${user.id}`} onClick={() => onBlock(user)} variant={user.isBlocked ? 'outline' : 'danger'} size="sm">
              {user.isBlocked ? 'Unblock' : 'Block'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map(u => (
          <MobileUserCard key={u.id} user={u} onBlock={handleBlock} />
        ))}
        {users.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No users found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
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
                    <Badge variant={u.role === 'admin' ? 'info' : 'default'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {u.createdAt ? format(new Date(u.createdAt), 'dd MMM yyyy') : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={u.isBlocked ? 'unavailable' : 'available'} size="sm">
                      {u.isBlocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role !== 'admin' && (
                      <Button id={`admin-toggle-block-${u.id}`} onClick={() => handleBlock(u)} variant={u.isBlocked ? 'outline' : 'danger'} size="sm">
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}