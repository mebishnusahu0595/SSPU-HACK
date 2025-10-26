import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

export default function Insurance() {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ policyNumber: '', policyType: 'Crop', provider: '', coverageAmount: '', premium: '', startDate: '', endDate: '', propertyId: '' });

  useEffect(() => { fetchPolicies(); }, []);

  async function fetchPolicies() {
    setLoading(true);
    try {
      const res = await api.get('/insurance');
      if (res.data?.success) setPolicies(res.data.data || []);
    } catch (err) {
      console.error('Fetch policies', err);
    } finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await api.post('/insurance', form);
      if (res.data?.success) {
        alert('Policy created');
        setForm({ policyNumber: '', policyType: 'Crop', provider: '', coverageAmount: '', premium: '', startDate: '', endDate: '', propertyId: '' });
        fetchPolicies();
      }
    } catch (err) {
      console.error('Create policy', err);
      alert(err.response?.data?.message || 'Failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="card p-4">
              <h2 className="text-2xl font-bold mb-4">Insurance Policies</h2>
              {loading ? <p>Loading...</p> : (
                policies.length === 0 ? <p>No policies yet.</p> : (
                  <ul className="space-y-3">
                    {policies.map(p => (
                      <li key={p._id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                        <div>
                          <div className="font-medium">{p.policyNumber} — {p.provider}</div>
                          <div className="text-sm text-gray-500">{p.policyType} • {p.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">Coverage: {p.coverageAmount}</div>
                          <div className="text-sm">Premium: {p.premium}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="card p-4">
              <h2 className="font-semibold mb-3">Create Policy</h2>
              <form onSubmit={handleCreate}>
                <input placeholder="Policy Number" value={form.policyNumber} onChange={e => setForm({...form, policyNumber: e.target.value})} className="input mb-2" />
                <input placeholder="Provider" value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="input mb-2" />
                <input placeholder="Coverage Amount" value={form.coverageAmount} onChange={e => setForm({...form, coverageAmount: e.target.value})} className="input mb-2" />
                <input placeholder="Premium" value={form.premium} onChange={e => setForm({...form, premium: e.target.value})} className="input mb-2" />
                <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input mb-2" />
                <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input mb-2" />
                <button type="submit" className="btn btn-primary w-full">Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
