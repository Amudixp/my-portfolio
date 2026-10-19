import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, Loader2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SkillCat {
  id: number;
  category: string;
  items: string[];
  displayOrder: number;
}

function SortableSkillRow({ cat, onEdit, onDelete }: { cat: SkillCat, onEdit: (e: SkillCat) => void, onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: cat.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-4 mb-3 rounded-lg border flex items-center gap-4 hover:shadow-md">
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600"><GripVertical size={20} /></div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">{cat.category}</h3>
        <div className="flex flex-wrap gap-1 mt-1">
          {cat.items?.map((item, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-brand-50 text-brand-700 text-xs rounded-full">{item}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(cat)} className="p-2 text-gray-500 hover:text-brand-600"><Edit2 size={16} /></button>
        <button onClick={() => onDelete(cat.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}

export function SkillsManager() {
  const [skills, setSkills] = useState<SkillCat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState<Partial<SkillCat> | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try { setSkills((await api.get('/skills')).data); } finally { setIsLoading(false); }
  };

  const handleDragEnd = async (e: any) => {
    if (e.active.id !== e.over.id) {
      const oldI = skills.findIndex(p => p.id === e.active.id);
      const newI = skills.findIndex(p => p.id === e.over.id);
      const newOrder = arrayMove(skills, oldI, newI).map((p, i) => ({ ...p, displayOrder: i }));
      setSkills(newOrder);
      for (const p of newOrder) {
        if (p.displayOrder !== skills.find(op => op.id === p.id)?.displayOrder) api.put(`/skills/${p.id}`, p);
      }
    }
  };

  const save = async () => {
    if (!currentCat?.category) return alert('Category is required');
    const payload = {
      ...currentCat,
      items: typeof currentCat.items === 'string' ? (currentCat.items as string).split(',').map(s=>s.trim()) : currentCat.items || [],
      displayOrder: currentCat.id ? currentCat.displayOrder : skills.length,
    };
    if (currentCat.id) await api.put(`/skills/${currentCat.id}`, payload);
    else await api.post('/skills', payload);
    setIsFormOpen(false); fetchSkills();
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold">Skills Manager</h1><button onClick={() => {setCurrentCat({}); setIsFormOpen(true)}} className="bg-brand-600 text-white px-4 py-2 rounded-lg flex"><Plus className="w-5 h-5 mr-2" />Add Category</button></div>
      {isFormOpen ? (
        <div className="bg-white p-6 rounded-xl border">
          <label className="block text-sm mb-1">Category Name</label>
          <input className="w-full border p-2 mb-4 rounded-lg" value={currentCat?.category || ''} onChange={e => setCurrentCat(c => ({...c!, category: e.target.value}))} />
          <label className="block text-sm mb-1">Skills (comma separated)</label>
          <input className="w-full border p-2 mb-6 rounded-lg" value={Array.isArray(currentCat?.items) ? currentCat?.items.join(', ') : currentCat?.items || ''} onChange={e => setCurrentCat(c => ({...c!, items: e.target.value as any}))} />
          <div className="flex justify-end gap-3"><button onClick={() => setIsFormOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={save} className="bg-brand-600 text-white px-4 py-2 rounded-lg">Save</button></div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div>{skills.map(c => <SortableSkillRow key={c.id} cat={c} onEdit={c => {setCurrentCat(c); setIsFormOpen(true)}} onDelete={async id => { if(window.confirm('Delete?')){ await api.delete(`/skills/${id}`); setSkills(skills.filter(s=>s.id!==id)); } }} />)}</div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
