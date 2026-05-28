'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/services';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FileText, CheckCircle, XCircle, FileBadge } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

function MobileVerificationCard({ doc, onVerify, processing }: {
  doc: any;
  onVerify: (userId: string, status: 'approved' | 'rejected') => void;
  processing: string | null;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
            {doc.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-slate-900 dark:text-white truncate">{doc.user?.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{doc.user?.email}</p>
          </div>
        </div>
        <Badge variant={doc.verificationStatus === 'approved' ? 'available' : doc.verificationStatus === 'rejected' ? 'unavailable' : 'warning'} size="sm">
          {doc.verificationStatus}
        </Badge>
      </div>
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs sm:text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">License No:</span>
          <span className="font-mono text-slate-700 dark:text-slate-200">{doc.licenseNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Expiry:</span>
          <span className="text-slate-700 dark:text-slate-200">{format(new Date(doc.licenseExpiry), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
          <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
            <FileText size={14} /> View Doc
          </a>
          {doc.verificationStatus === 'pending' && (
            <div className="flex items-center gap-2">
              <Button onClick={() => onVerify(doc.userId, 'approved')} disabled={processing === doc.userId} variant="ghost" size="sm" className="p-1.5 text-green-600 dark:hover:bg-green-900/30">
                <CheckCircle size={16} />
              </Button>
              <Button onClick={() => onVerify(doc.userId, 'rejected')} disabled={processing === doc.userId} variant="ghost" size="sm" className="p-1.5 text-red-600 dark:hover:bg-red-900/30">
                <XCircle size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminVerificationsTab() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const res = await adminApi.getVerifications();
      setDocs(res.data.data || []);
    } catch {
      toast.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string, status: 'approved' | 'rejected') => {
    setProcessing(userId);
    try {
      await adminApi.verifyUser(userId, status);
      toast.success(`User verification ${status}`);
      loadDocs();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileBadge className="text-blue-500" />
          Driver Verifications
        </h2>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {docs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No documents uploaded yet</p>
          </div>
        ) : (
          docs.map(doc => (
            <MobileVerificationCard key={doc.id} doc={doc} onVerify={handleVerify} processing={processing} />
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block card-flat overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">User</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">License No</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Expiry</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Document</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No documents uploaded yet</td></tr>
              ) : (
                docs.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white">{doc.user?.name}</p>
                      <p className="text-xs text-slate-500">{doc.user?.email}</p>
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-300">{doc.licenseNumber}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {format(new Date(doc.licenseExpiry), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4">
                      <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                        <FileText size={16} /> View Doc
                      </a>
                    </td>
                    <td className="p-4">
                      <Badge variant={doc.verificationStatus === 'approved' ? 'available' : doc.verificationStatus === 'rejected' ? 'unavailable' : 'warning'} size="sm">
                        {doc.verificationStatus}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {doc.verificationStatus === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button onClick={() => handleVerify(doc.userId, 'approved')} disabled={processing === doc.userId} variant="ghost" size="sm" className="p-1.5 text-green-600 dark:hover:bg-green-900/30">
                            <CheckCircle size={18} />
                          </Button>
                          <Button onClick={() => handleVerify(doc.userId, 'rejected')} disabled={processing === doc.userId} variant="ghost" size="sm" className="p-1.5 text-red-600 dark:hover:bg-red-900/30">
                            <XCircle size={18} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}