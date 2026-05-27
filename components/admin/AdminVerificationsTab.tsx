import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/services';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FileText, CheckCircle, XCircle, FileBadge } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileBadge className="text-blue-500" />
          Driver Verifications
        </h2>
      </div>

      <div className="card-flat overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">License No</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Expiry</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Document</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No documents uploaded yet</td></tr>
              ) : (
                docs.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-50 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white">{doc.user?.name}</p>
                      <p className="text-xs text-gray-500">{doc.user?.email}</p>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-600 dark:text-gray-300">{doc.licenseNumber}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {format(new Date(doc.licenseExpiry), 'MMM dd, yyyy')}
                    </td>
                    <td className="p-4">
                      <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                        <FileText size={16} /> View Doc
                      </a>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${doc.verificationStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                          doc.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {doc.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {doc.verificationStatus === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleVerify(doc.userId, 'approved')}
                            disabled={processing === doc.userId}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleVerify(doc.userId, 'rejected')}
                            disabled={processing === doc.userId}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
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
