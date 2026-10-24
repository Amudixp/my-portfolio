import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const updateToolbar = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setToolbarVisible(false);
      return;
    }
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const container = editorRef.current?.getBoundingClientRect();
    if (!container) return;
    setPosition({ top: rect.top - container.top - 44, left: rect.left - container.left });
    setToolbarVisible(true);
  };

  const exec = (command: string, valueArg?: string) => {
    document.execCommand(command, false, valueArg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateToolbar();
  };

  return (
    <div className="relative">
      {toolbarVisible ? (
        <div
          className="absolute z-10 flex items-center gap-1 rounded-lg bg-[#1f2937] px-2 py-1 text-xs text-white shadow-lg"
          style={{ top: position.top, left: position.left }}
        >
          <button type="button" className="px-1.5 py-0.5 hover:rounded hover:bg-white/10" onClick={() => exec('bold')}>
            <strong>B</strong>
          </button>
          <button type="button" className="px-1.5 py-0.5 hover:rounded hover:bg-white/10" onClick={() => exec('italic')}>
            <em>I</em>
          </button>
          <button type="button" className="px-1.5 py-0.5 hover:rounded hover:bg-white/10" onClick={() => exec('underline')}>
            <u>U</u>
          </button>
          <button type="button" className="px-1.5 py-0.5 hover:rounded hover:bg-white/10" onClick={() => exec('insertUnorderedList')}>
            • List
          </button>
          <button type="button" className="px-1.5 py-0.5 hover:rounded hover:bg-white/10" onClick={() => exec('insertOrderedList')}>
            1. List
          </button>
        </div>
      ) : null}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onMouseUp={updateToolbar}
        onKeyUp={updateToolbar}
        data-placeholder={placeholder}
        className="min-h-[140px] rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm text-ink shadow-[0_1px_2px_rgba(0,0,0,0.01)] focus-within:outline-none focus-within:ring-1 focus-within:ring-[#9ca3af] [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-[#9ca3af]"
      />
    </div>
  );
}
