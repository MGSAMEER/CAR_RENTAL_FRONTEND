'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, X, Save } from 'lucide-react';
import type { Car as CarType } from '@/lib/types';
import { carsApi, branchesApi } from '@/lib/services';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const emptyForm = {
  name: '', brand: '', model: '', type: 'sedan',
  pricePerDay: '', seats: '5', transmission: 'manual',
  fuelType: 'petrol', description: '', imageUrl: '', availability: true,
  branchId: '',
};

interface Props { cars: CarType[]; setCars: React.Dispatch<React.SetStateAction<CarType[]>>; }

function MobileCarCard({ car, onEdit, onDelete, onToggle }: { 
  car: CarType; 
  onEdit: (car: CarType) => void; 
  onDelete: (id: string) => void; 
  onToggle: (car: CarType) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-4 mb-3 last:mb-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {car.imageUrl && (
            <img src={car.imageUrl} alt={car.name} className="w-16 h-12 object-cover rounded-lg border border-slate-100 dark:border-slate-700 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-slate-900 dark:text-white truncate">{car.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 capitalize">{car.type}</p>
            <p className="text-xs text-slate-400">{car.brand}</p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-2">
          <p className="text-lg font-bold text-slate-800 dark:text-white">₹{Number(car.pricePerDay).toLocaleString()}</p>
          <p className="text-xs text-slate-400">/day</p>
        </div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
        <Badge variant={car.availability ? 'available' : 'unavailable'} size="sm" className="capitalize">
          {car.availability ? 'Available' : 'Unavailable'}
        </Badge>
        <div className="flex items-center gap-2">
          <Button id={`mobile-edit-car-${car.id}`} onClick={() => onEdit(car)} variant="ghost" size="sm" className="p-1.5">
            <Pencil size={14} />
          </Button>
          <Button id={`mobile-delete-car-${car.id}`} onClick={() => onDelete(car.id)} variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 dark:hover:bg-red-900/30">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

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
      // Clean up form data - remove empty optional fields
      const payload: any = { ...form };
      if (!payload.imageUrl) delete payload.imageUrl;
      if (!payload.description) delete payload.description;
      if (!payload.branchId) delete payload.branchId;
      if (!payload.model) delete payload.model;
      
      if (editing) {
        const res = await carsApi.update(editing.id, payload);
        setCars(prev => prev.map(c => c.id === editing.id ? res.data.data! : c));
        toast.success('Car updated!');
      } else {
        const res = await carsApi.create(payload);
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
        <Button id="add-car-btn" onClick={openAdd} variant="primary" size="sm">
          <Plus size={16} /> Add Car
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {cars.map(car => (
          <MobileCarCard key={car.id} car={car} onEdit={openEdit} onDelete={handleDelete} onToggle={toggleAvail} />
        ))}
        {cars.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No cars found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
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
                    <Badge variant={car.availability ? 'available' : 'unavailable'} size="sm" icon={car.availability ? <CheckCircle2 size={11} /> : <XCircle size={11} />}>
                      {car.availability ? 'Available' : 'Unavailable'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Button id={`edit-car-btn-${car.id}`} onClick={() => openEdit(car)} variant="ghost" size="sm" className="p-1.5">
                        <Pencil size={14} />
                      </Button>
                      <Button id={`delete-car-btn-${car.id}`} onClick={() => handleDelete(car.id)} variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700 dark:hover:bg-red-900/30">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">No cars found</td>
                </tr>
              )}
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
                <Button id="car-form-save-btn" onClick={handleSave} disabled={saving} isLoading={saving} variant="primary" icon={<Save size={15} />} iconPosition="left">
                  {editing ? 'Update Car' : 'Add Car'}
                </Button>
                <Button onClick={() => setShowForm(false)} variant="secondary">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}