import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Save, Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export function EducationManager() {
  const [edu, setEdu] = useState<any>(null);
  const [certs, setCerts] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reusable modal states
  const [modalType, setModalType] = useState<'cert'|'award'|null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const eduRes = await api.get('/education');
      setEdu(eduRes.data.education);
      const cRes = await api.get('/certifications');
      setCerts(cRes.data);
      const aRes = await api.get('/awards');
      setAwards(aRes.data);
    } finally { setIsLoading(false); }
  };

  const saveEdu = async () => {
    const payload = { ...edu, relevantCourseworks: typeof edu.relevantCourseworks === 'string' ? (edu.relevantCourseworks as string).split(',').map(s=>s.trim()) : edu.relevantCourseworks };
    await api.put('/education', payload);
    alert('Education saved');
  };

  const saveModal = async () => {
    if (modalType === 'cert') {
      if (currentItem.id) await api.put(`/certifications/${currentItem.id}`, currentItem);
      else await api.post('/certifications', currentItem);
    } else {
      if (currentItem.id) await api.put(`/awards/${currentItem.id}`, currentItem);
      else await api.post('/awards', currentItem);
    }
    setModalType(null); fetchAll();
  };

  const deleteItem = async (type: 'cert'|'award', id: number) => {
    if (window.confirm('Delete?')) {
      await api.delete(`/${type === 'cert' ? 'certifications' : 'awards'}/${id}`);
      fetchAll();
    }
  };

  if (isLoading) return <div className="flex justify-center"><Loader2 className="animate-spin text-brand-600 w-8 h-8" /></div>;

  return (
    <div className="space-y-8">
      {/* Education Info */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Formal Education</h2><button onClick={saveEdu} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex"><Save className="w-4 h-4 mr-2" />Save</button></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm mb-1">Degree</label><input className="w-full border p-2 rounded-lg" value={edu?.degree||''} onChange={e=>setEdu({...edu, degree: e.target.value})} /></div>
          <div><label className="block text-sm mb-1">Institution</label><input className="w-full border p-2 rounded-lg" value={edu?.institution||''} onChange={e=>setEdu({...edu, institution: e.target.value})} /></div>
          <div><label className="block text-sm mb-1">Period</label><input className="w-full border p-2 rounded-lg" value={edu?.period||''} onChange={e=>setEdu({...edu, period: e.target.value})} /></div>
          <div><label className="block text-sm mb-1">GPA</label><input className="w-full border p-2 rounded-lg" value={edu?.gpa||''} onChange={e=>setEdu({...edu, gpa: e.target.value})} /></div>
          <div><label className="block text-sm mb-1">Credits</label><input className="w-full border p-2 rounded-lg" value={edu?.credits||''} onChange={e=>setEdu({...edu, credits: e.target.value})} /></div>
          <div className="col-span-2"><label className="block text-sm mb-1">Relevant Courseworks (comma sep)</label><textarea className="w-full border p-2 rounded-lg" value={Array.isArray(edu?.relevantCourseworks)?edu.relevantCourseworks.join(', '):edu?.relevantCourseworks||''} onChange={e=>setEdu({...edu, relevantCourseworks: e.target.value})} /></div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Certifications</h2><button onClick={()=>{setCurrentItem({}); setModalType('cert')}} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex"><Plus className="w-4 h-4 mr-2" />Add Cert</button></div>
        {certs.map(c => (
          <div key={c.id} className="flex justify-between items-center p-3 border-b"><div className="flex-1"><b>{c.title}</b> ({c.issuer})</div>
          <button onClick={()=>{setCurrentItem(c); setModalType('cert')}} className="p-2 text-gray-500 hover:text-brand-600"><Edit2 size={16} /></button>
          <button onClick={()=>deleteItem('cert', c.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button></div>
        ))}
      </div>

      {/* Awards */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Awards</h2><button onClick={()=>{setCurrentItem({}); setModalType('award')}} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex"><Plus className="w-4 h-4 mr-2" />Add Award</button></div>
        {awards.map(a => (
          <div key={a.id} className="flex justify-between items-center p-3 border-b"><div className="flex-1"><b>{a.title}</b> ({a.year})</div>
          <button onClick={()=>{setCurrentItem(a); setModalType('award')}} className="p-2 text-gray-500 hover:text-brand-600"><Edit2 size={16} /></button>
          <button onClick={()=>deleteItem('award', a.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button></div>
        ))}
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] max-w-[90%]">
            <h3 className="text-lg font-bold mb-4">{modalType === 'cert' ? 'Certification' : 'Award'}</h3>
            <div className="space-y-4">
              <div><label className="block text-sm mb-1">Title</label><input className="w-full border p-2 rounded-lg" value={currentItem?.title||''} onChange={e=>setCurrentItem({...currentItem, title: e.target.value})} /></div>
              {modalType === 'cert' ? (
                <>
                  <div><label className="block text-sm mb-1">Issuer</label><input className="w-full border p-2 rounded-lg" value={currentItem?.issuer||''} onChange={e=>setCurrentItem({...currentItem, issuer: e.target.value})} /></div>
                  <div><label className="block text-sm mb-1">Date</label><input className="w-full border p-2 rounded-lg" value={currentItem?.date||''} onChange={e=>setCurrentItem({...currentItem, date: e.target.value})} /></div>
                  <div><label className="block text-sm mb-1">Link</label><input className="w-full border p-2 rounded-lg" value={currentItem?.link||''} onChange={e=>setCurrentItem({...currentItem, link: e.target.value})} /></div>
                </>
              ) : (
                <>
                  <div><label className="block text-sm mb-1">Year</label><input className="w-full border p-2 rounded-lg" value={currentItem?.year||''} onChange={e=>setCurrentItem({...currentItem, year: e.target.value})} /></div>
                  <div><label className="block text-sm mb-1">Tag (e.g. National Scholarship)</label><input className="w-full border p-2 rounded-lg" value={currentItem?.tag||''} onChange={e=>setCurrentItem({...currentItem, tag: e.target.value})} /></div>
                  <div><label className="block text-sm mb-1">Description</label><textarea className="w-full border p-2 rounded-lg" value={currentItem?.description||''} onChange={e=>setCurrentItem({...currentItem, description: e.target.value})} /></div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={()=>setModalType(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={saveModal} className="bg-brand-600 text-white px-4 py-2 rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
