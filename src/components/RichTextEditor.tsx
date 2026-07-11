import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '../lib/upload';

interface RichTextEditorProps {
  defaultValue?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// Minimal contentEditable-based rich text editor (bold/italic/underline/link/
// image) for announcement summaries. Uncontrolled by design — the parent
// should force a remount (e.g. key={editingId ?? 'new'}) when switching which
// entry is being edited, rather than feeding `defaultValue` back in live.
//
// Content is set imperatively once on mount (not via dangerouslySetInnerHTML
// in the JSX) so the div's children are fully DOM-owned afterwards — letting
// React re-render the __html prop on every keystroke would race the browser's
// own contentEditable mutations and wipe out what was just typed.
export default function RichTextEditor({ defaultValue = '', onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = defaultValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emitChange = () => onChange(editorRef.current?.innerHTML ?? '');

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
  };

  const handleLink = () => {
    const url = window.prompt('請輸入連結網址（例：https://example.com）');
    if (url) exec('createLink', url);
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadFile(`announcements/${Date.now()}-${file.name}`, file);
      exec('insertImage', url);
    } catch {
      window.alert('圖片上傳失敗，請稍後再試。');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <button type="button" onClick={() => exec('bold')} className="p-1.5 rounded hover:bg-slate-200 text-gray-600" title="粗體">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('italic')} className="p-1.5 rounded hover:bg-slate-200 text-gray-600" title="斜體">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('underline')} className="p-1.5 rounded hover:bg-slate-200 text-gray-600" title="底線">
          <Underline className="w-4 h-4" />
        </button>
        <button type="button" onClick={handleLink} className="p-1.5 rounded hover:bg-slate-200 text-gray-600" title="插入連結">
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleImagePick}
          disabled={uploading}
          className="p-1.5 rounded hover:bg-slate-200 text-gray-600 disabled:opacity-40"
          title="插入圖片"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        {uploading && <span className="text-xs text-gray-400 ml-1">圖片上傳中...</span>}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        data-placeholder={placeholder}
        className="min-h-[120px] px-3 py-2 text-sm focus:outline-none [&_img]:max-w-full [&_img]:rounded-lg [&_a]:text-[#003366] [&_a]:underline empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
      />
    </div>
  );
}
