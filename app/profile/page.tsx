'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, BookOpen, Edit2, Save, X, FileBadge, UploadCloud, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { usersApi } from '@/lib/services';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import type { Booking } from '@/lib/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [dlFile, setDlFile] = useState<File | null>(null);
  const [dlNumber, setDlNumber] = useState('');
  const [dlExpiry, setDlExpiry] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setName(user?.name || '');
    if (user?.id) {
      Promise.all([
        usersApi.getBookings(user.id),
        usersApi.getVerificationStatus()
      ])
        .then(([bookingsRes, verifRes]) => {
          setBookings(bookingsRes.data.data || []);
          setVerification(verifRes.data.data || { verificationStatus: 'unverified' });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  const handleDlUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlFile || !dlNumber || !dlExpiry) {
      toast.error('Please fill all fields and select a file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('licenseNumber', dlNumber);
      formData.append('licenseExpiry', dlExpiry);
      formData.append('licenseFile', dlFile);
      const res = await usersApi.uploadLicense(formData);
      setVerification(res.data.data);
      toast.success('Driving License uploaded successfully!');
      setDlFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload license');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const res = await usersApi.update(user.id, { name });
      setUser(res.data.data!);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage text="Loading profile..." />;

  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.totalCost), 0);

  return (
    <div className="page-container animate-fade-in">
      <h1 className="section-title mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={36} className="text-white" />
            </div>

            {editing ? (
              <div className="space-y-3 mb-4">
                <input
                  id="profile-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-center"
                />
                <div className="flex gap-2 justify-center">
                  <Button id="save-profile-btn" onClick={handleSave} disabled={saving} variant="primary" size="sm" isLoading={saving} icon={<Save size={14} />} iconPosition="left">
                    Save
                  </Button>
                  <Button onClick={() => { setEditing(false); setName(user?.name || ''); }} variant="ghost" size="sm" icon={<X size={14} />} iconPosition="left">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                <button id="edit-profile-btn" onClick={() => setEditing(true)}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 mx-auto mb-4">
                  <Edit2 size={12} /> Edit name
                </button>
              </>
            )}

            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-700 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-primary-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-primary-700">{bookings.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Bookings</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-green-700">₹{totalSpent.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-0.5">Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Verification & Booking History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Driver Verification */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileBadge size={20} className="text-blue-500" /> Driver Verification
            </h2>
            <div className="card-flat p-6 border-2 border-dashed border-gray-200 dark:border-slate-700">
              {verification?.verificationStatus === 'approved' ? (
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <CheckCircle size={24} />
                  <div>
                    <p className="font-bold">Verification Approved</p>
                    <p className="text-sm">You are ready to book any car.</p>
                  </div>
                </div>
              ) : verification?.verificationStatus === 'pending' ? (
                <div className="flex items-center gap-3 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                  <Clock size={24} />
                  <div>
                    <p className="font-bold">Verification Pending</p>
                    <p className="text-sm">Your document is under review by admin.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleDlUpload} className="space-y-4">
                  {verification?.verificationStatus === 'rejected' && (
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-4">
                      <XCircle size={24} />
                      <div>
                        <p className="font-bold">Verification Rejected</p>
                        <p className="text-sm">Please upload a valid driving license.</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">License Number</label>
                      <input type="text" value={dlNumber} onChange={e => setDlNumber(e.target.value)} required placeholder="MH12XXXX1234" className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Expiry Date</label>
                      <input type="date" value={dlExpiry} onChange={e => setDlExpiry(e.target.value)} required min={new Date().toISOString().split('T')[0]} className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Upload Document (Image/PDF)</label>
                    <div className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setDlFile(e.target.files?.[0] || null)} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="pointer-events-none">
                        <UploadCloud size={30} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                          {dlFile ? dlFile.name : 'Click or drag file to upload'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Max 5MB (JPG, PNG, PDF)</p>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={uploading} variant="primary" fullWidth={false} isLoading={uploading} className="w-full md:w-auto">
                    Submit Verification
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-primary-500" /> Booking History
            </h2>

            {bookings.length === 0 ? (
              <div className="card-flat p-10 text-center">
                <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="card-flat p-4 flex items-center justify-between gap-4" id={`profile-booking-${booking.id}`}>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.car?.brand} {booking.car?.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(booking.startDate), 'dd MMM')} → {format(new Date(booking.endDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{Number(booking.totalCost).toLocaleString()}</p>
                      <span className={`text-xs capitalize px-2 py-0.5 rounded-full ${
                        booking.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
