import type { ReactNode } from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

interface ListRowProps {
  handle?: ReactNode;
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ListRow({ handle, leading, title, subtitle, actions, onEdit, onDelete }: ListRowProps) {
  const rowActions = actions ?? (
    <div className="flex items-center gap-1">
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-[#f3f4f6] hover:text-ink"
        >
          <Pencil size={15} />
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={15} />
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="flex items-center gap-3 border-b border-[#f1f1ef] px-6 py-3 last:border-b-0 sm:px-8">
      {handle ?? (
        <div className="text-[#9ca3af]">
          <GripVertical size={16} />
        </div>
      )}
      {leading ? <div className="shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{title}</div>
        {subtitle ? <div className="truncate text-xs text-[#6b7280]">{subtitle}</div> : null}
      </div>
      {rowActions}
    </div>
  );
}
