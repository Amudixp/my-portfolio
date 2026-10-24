import type { ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Identifiable {
  id: number | string;
}

interface SortableListProps<T extends Identifiable> {
  items: T[];
  onReorder: (ids: (number | string)[]) => void;
  renderItem: (item: T) => ReactNode;
  empty?: ReactNode;
}

/**
 * Drag and drop list shared by every collection page. The order is persisted
 * with a single bulk request instead of one request per row.
 */
export function SortableList<T extends Identifiable>({
  items,
  onReorder,
  renderItem,
  empty,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = items.slice();
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    onReorder(next.map((item) => item.id));
  };

  if (items.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: number | string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        'flex items-start gap-3 rounded-xl border border-line bg-page-light p-3 shadow-card',
        isDragging ? 'opacity-70' : '',
      ].join(' ')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="mt-1 cursor-grab text-muted transition-colors hover:text-accent active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
