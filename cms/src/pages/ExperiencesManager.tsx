import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Experience {
  id: number;
  year: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  logoImagePath?: string;
  logoColor?: string;
  displayOrder: number;
}

function SortableExpRow({ exp, onEdit, onDelete }: { exp: Experience, onEdit: (e: Experience) => void, onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exp.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-4 mb-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical size={20} />
      </div>
      <div className="w-12 h-12 rounded flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: exp.logoColor || '#f3f4f6' }}>
        {exp.logoImagePath ? <img src={exp.logoImagePath} alt={exp.title} className="w-8 h-8 object-contain" /> : <ImageIcon size={20} className="text-gray-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{exp.title}</h3>
        <p className="text-xs text-gray-500 truncate">{exp.organization} • {exp.year}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(exp)} className="p-2 text-gray-500 hover:text-brand-600 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(exp.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export function ExperiencesManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => { fetchExperiences(); }, []);

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/experiences');
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    } finally { setIsLoading(false); }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = experiences.findIndex(p => p.id === active.id);
      const newIndex = experiences.findIndex(p => p.id === over.id);
      const newOrder = arrayMove(experiences, oldIndex, newIndex).map((p, idx) => ({ ...p, displayOrder: idx }));
      setExperiences(newOrder);
      for (const p of newOrder) {
        if (p.displayOrder !== experiences.find(oldP => oldP.id === p.id)?.displayOrder) {
          api.put(`/experiences/${p.id}`, p).catch(console.error);
        }
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this experience?')) {
      await api.delete(`/experiences/${id}`);
      setExperiences(experiences.filter(p => p.id !== id));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadingImage(true);
    try {
      const { data: sigData } = await api.post('/upload/signature', { folder: 'portfolio/experiences' });
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp);
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, { method: 'POST', body: formData });
      const cldData = await res.json();
      if (cldData.secure_url) setCurrentExp(prev => prev ? { ...prev, logoImagePath: cldData.secure_url } : null);
    } catch (err) {
      alert('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveExperience = async () => {
    if (!currentExp?.title) return alert('Title is required');
    setIsSaving(true);
    try {
      const payload = {
        ...currentExp,
        tags: typeof currentExp.tags === 'string' ? (currentExp.tags as string).split(',').map(s=>s.trim()) : currentExp.tags || [],
        displayOrder: currentExp.id ? currentExp.displayOrder : experiences.length,
      };
      if (currentExp.id) await api.put(`/experiences/${currentExp.id}`, payload);
      else await api.post('/experiences', payload);
      setIsFormOpen(false);
      fetchExperiences();
    } catch (err) {
      alert('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Experiences Manager</h1>
        <button onClick={() => { setCurrentExp({ tags: [] }); setIsFormOpen(true); }} className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg">
          <Plus className="w-5 h-5 mr-2" /> Add Experience
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white rounded-xl border p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm mb-1">Title</label><input type="text" className="w-full border rounded-lg px-3 py-2" value={currentExp?.title || ''} onChange={e => setCurrentExp(p => ({...p!, title: e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Organization</label><input type="text" className="w-full border rounded-lg px-3 py-2" value={currentExp?.organization || ''} onChange={e => setCurrentExp(p => ({...p!, organization: e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Year</label><input type="text" className="w-full border rounded-lg px-3 py-2" value={currentExp?.year || ''} onChange={e => setCurrentExp(p => ({...p!, year: e.target.value}))} /></div>
            <div><label className="block text-sm mb-1">Logo Background Color (Hex)</label><input type="text" className="w-full border rounded-lg px-3 py-2" value={currentExp?.logoColor || ''} onChange={e => setCurrentExp(p => ({...p!, logoColor: e.target.value}))} /></div>
          </div>
          <div className="mb-4"><label className="block text-sm mb-1">Description</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={currentExp?.description || ''} onChange={e => setCurrentExp(p => ({...p!, description: e.target.value}))} /></div>
          <div className="mb-4"><label className="block text-sm mb-1">Tags (comma separated)</label><input type="text" className="w-full border rounded-lg px-3 py-2" value={Array.isArray(currentExp?.tags) ? currentExp?.tags.join(', ') : currentExp?.tags || ''} onChange={e => setCurrentExp(p => ({...p!, tags: e.target.value as any}))} /></div>
          <div className="mb-6">
            <label className="block text-sm mb-2">Logo Image</label>
            <div className="flex items-center gap-4">
              {currentExp?.logoImagePath && <img src={currentExp.logoImagePath} alt="preview" className="w-12 h-12 object-contain" />}
              <input type="file" onChange={handleImageUpload} disabled={uploadingImage} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 border rounded-lg">Cancel</button>
            <button onClick={saveExperience} disabled={isSaving} className="px-4 py-2 bg-brand-600 text-white rounded-lg">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experiences.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div>
              {experiences.map(exp => <SortableExpRow key={exp.id} exp={exp} onEdit={(e) => {setCurrentExp(e); setIsFormOpen(true);}} onDelete={handleDelete} />)}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
