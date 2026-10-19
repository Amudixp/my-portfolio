import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  fullDescription?: string;
  tech: string[];
  image?: string;
  link?: string;
  metrics: { id: number, value: string; label: string }[];
  displayOrder: number;
}

// Sortable row component
function SortableProjectRow({ project, onEdit, onDelete }: { project: Project, onEdit: (p: Project) => void, onDelete: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-4 mb-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
        <GripVertical size={20} />
      </div>
      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={20} className="text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{project.title}</h3>
        <p className="text-xs text-gray-500 truncate">{project.subtitle} • {project.year}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onEdit(project)} className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(project.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      
      // Update local state instantly
      const updatedProjects = newOrder.map((p, idx) => ({ ...p, displayOrder: idx }));
      setProjects(updatedProjects);
      
      // Update backend one by one (or create a bulk endpoint later, for now just sequential PUTs)
      for (const p of updatedProjects) {
        if (p.displayOrder !== projects.find(oldP => oldP.id === p.id)?.displayOrder) {
          api.put(`/projects/${p.id}`, p).catch(console.error);
        }
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      // 1. Get presigned signature from backend
      const { data: sigData } = await api.post('/upload/signature', { folder: 'portfolio/projects' });
      
      // 2. Upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sigData.apiKey);
      formData.append('timestamp', sigData.timestamp.toString());
      formData.append('signature', sigData.signature);
      formData.append('folder', sigData.folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      
      const cldData = await cloudinaryRes.json();
      if (cldData.secure_url) {
        setCurrentProject(prev => prev ? { ...prev, image: cldData.secure_url } : null);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProject = async () => {
    if (!currentProject?.title) return alert('Title is required');
    
    setIsSaving(true);
    try {
      const payload = {
        ...currentProject,
        tech: typeof currentProject.tech === 'string' ? (currentProject.tech as string).split(',').map(s=>s.trim()) : currentProject.tech || [],
        displayOrder: currentProject.id ? currentProject.displayOrder : projects.length,
      };

      if (currentProject.id) {
        await api.put(`/projects/${currentProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setIsFormOpen(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects Manager</h1>
        <button
          onClick={() => { setCurrentProject({ tech: [], metrics: [] }); setIsFormOpen(true); }}
          className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {isFormOpen ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">{currentProject?.id ? 'Edit Project' : 'New Project'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-gray-700 mb-1">Title</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={currentProject?.title || ''} onChange={e => setCurrentProject(p => ({...p!, title: e.target.value}))} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Subtitle</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={currentProject?.subtitle || ''} onChange={e => setCurrentProject(p => ({...p!, subtitle: e.target.value}))} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Year</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={currentProject?.year || ''} onChange={e => setCurrentProject(p => ({...p!, year: e.target.value}))} /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Link URL</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={currentProject?.link || ''} onChange={e => setCurrentProject(p => ({...p!, link: e.target.value}))} /></div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Short Description</label>
            <textarea className="w-full px-3 py-2 border rounded-lg" rows={2} value={currentProject?.description || ''} onChange={e => setCurrentProject(p => ({...p!, description: e.target.value}))} />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Full Description (Markdown supported later)</label>
            <textarea className="w-full px-3 py-2 border rounded-lg" rows={4} value={currentProject?.fullDescription || ''} onChange={e => setCurrentProject(p => ({...p!, fullDescription: e.target.value}))} />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Tech Stack (comma separated)</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" value={Array.isArray(currentProject?.tech) ? currentProject?.tech.join(', ') : currentProject?.tech || ''} onChange={e => setCurrentProject(p => ({...p!, tech: e.target.value as any}))} />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Project Image</label>
            <div className="flex items-center gap-4">
              {currentProject?.image && <img src={currentProject.image} alt="preview" className="w-20 h-20 object-cover rounded-lg border" />}
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                <button type="button" disabled={uploadingImage} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border hover:bg-gray-200 flex items-center">
                  {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                  {uploadingImage ? 'Uploading...' : (currentProject?.image ? 'Change Image' : 'Upload Image')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button onClick={saveProject} disabled={isSaving} className="px-4 py-2 bg-brand-600 text-white rounded-lg flex items-center disabled:opacity-50">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div>
              {projects.length === 0 && <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed">No projects found. Add one above.</p>}
              {projects.map(project => (
                <SortableProjectRow key={project.id} project={project} onEdit={(p) => {setCurrentProject(p); setIsFormOpen(true);}} onDelete={handleDelete} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
