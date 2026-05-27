'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, X, Save } from 'lucide-react';
import type { Car as CarType } from '@/lib/types';
import { carsApi, branchesApi } from '@/lib/services';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '', brand: '', model: '', type: 'sedan',
  pricePerDay: '', seats: '5', transmission: 'manual',
  fuelType: 'petrol', description: '', imageUrl: '', availability: true,
  branchId: '',
};

interface Props { cars: CarType[]; setCars: React.Dispatch<React.SetStateAction<CarType[]>>; }

export default function AdminCarsTab({ cars, setCars }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CarType | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    branchesApi.getAll().then((res: any) => setBranches(res.data.data || []));
  }, []);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm }); setShowForm(true); };
  const openEdit = (car: CarType) => {
    setEditing(car);
    setForm({ name: car.name, brand: car.brand, model: car.model, type: car.type,
      pricePerDay: String(car.pricePerDay), seats: String(car.seats),
      transmission: car.transmission, fuelType: car.fuelType,
      description: car.description || '', imageUrl: car.imageUrl || '', availability: car.availability,
      branchId: car.branchId || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await carsApi.update(editing.id, form as any);
        setCars(prev => prev.map(c => c.id === editing.id ? res.data.data! : c));
        toast.success('Car updated!');
      } else {
        const res = await carsApi.create(form as any);
        setCars(prev => [res.data.data!, ...prev]);
        toast.success('Car added!');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save car');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this car? Related bookings will also be removed.')) return;
    try {
      await carsApi.delete(id);
      setCars(prev => prev.filter(c => c.id !== id));
      toast.success('Car deleted');
    } catch { toast.error('Failed to delete car'); }
  };

  const toggleAvail = async (car: CarType) => {
    try {
      const res = await carsApi.update(car.id, { availability: !car.availability });
      setCars(prev => prev.map(c => c.id === car.id ? res.data.data! : c));
      toast.success(`Marked as ${!car.availability ? 'available' : 'unavailable'}`);
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{cars.length} cars in fleet</p>
        <button id="add-car-btn" onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> Add Car
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {['Car', 'Type', 'Price/Day', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {cars.map(car => (
                <tr key={car.id} id={`admin-car-row-${car.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {car.imageUrl && (
                        <img src={car.imageUrl} alt={car.name} className="w-12 h-8 object-cover rounded-lg border border-slate-100 dark:border-slate-700" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{car.name}</p>
                        <p className="text-xs text-slate-400">{car.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-slate-600 dark:text-slate-300">{car.type}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">₹{Number(car.pricePerDay).toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleAvail(car)} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${car.availability ? 'badge-available' : 'badge-unavailable'}`}>
                      {car.availability ? <><CheckCircle2 size={11} /> Available</> : <><XCircle size={11} /> Unavailable</>}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button id={`edit-car-btn-${car.id}`} onClick={() => openEdit(car)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"><Pencil size={14} /></button>
                      <button id={`delete-car-btn-${car.id}`} onClick={() => handleDelete(car.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Edit Car' : 'Add New Car'}</h2>
              <button id="close-car-form-btn" onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'name', label: 'Car Name', placeholder: 'e.g. Swift LXI' },
                { key: 'brand', label: 'Brand', placeholder: 'e.g. Maruti Suzuki' },
                { key: 'model', label: 'Model', placeholder: 'e.g. Swift' },
                { key: 'pricePerDay', label: 'Price/Day (₹)', placeholder: '1200', type: 'number' },
                { key: 'imageUrl', label: 'Image URL', placeholder: '/cars/swift.png or https://...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{f.label}</label>
                  <input id={`car-form-${f.key}`} type={f.type || 'text'} placeholder={f.placeholder}
                    value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="input" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select id="car-form-type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input">
                    {['sedan', 'suv', 'hatchback', 'luxury', 'electric'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seats</label>
                  <input id="car-form-seats" type="number" min="2" max="9" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transmission</label>
                  <select id="car-form-transmission" value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })} className="input">
                    <option value="manual">Manual</option><option value="automatic">Automatic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fuel Type</label>
                  <select id="car-form-fuel" value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })} className="input">
                    {['petrol', 'diesel', 'electric', 'hybrid'].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pickup Branch</label>
                <select id="car-form-branch" value={form.branchId} onChange={e => setForm({ ...form, branchId: e.target.value })} className="input">
                  <option value="">Select Pickup Location</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea id="car-form-desc" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input resize-none" placeholder="Short description..." />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.availability} onChange={e => setForm({ ...form, availability: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Available for booking</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button id="car-form-save-btn" onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                  <Save size={15} /> {saving ? 'Saving...' : editing ? 'Update Car' : 'Add Car'}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
