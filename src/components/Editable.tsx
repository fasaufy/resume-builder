import { useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { useUi } from '../store/ui';

const supportsFieldSizing = typeof CSS !== 'undefined' && CSS.supports?.('field-sizing', 'content');

interface EditableProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  /** Render a growing <textarea> instead of an <input>. */
  multiline?: boolean;
  /** Inline, content-width input (.edi). */
  inline?: boolean;
  rows?: number;
  className?: string;
  style?: CSSProperties;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Focus-target hooks used by list keyboard handling. */
  bid?: string;
  sid?: string;
  /** Element used while exporting (plain text for ATS). Default: <span> for inline fields, <p> otherwise. */
  printAs?: 'h1' | 'h2' | 'p' | 'span';
}

/**
 * On-canvas text field (.ed / .edi): transparent, inherits the page's font,
 * grows with its content and shows the layout's placeholder when empty.
 * While exporting it becomes plain text (no form fields in the PDF) and empty fields render nothing.
 */
export function Editable({ value, onChange, placeholder, label, multiline, inline, rows = 1, className, style, onKeyDown, bid, sid, printAs }: EditableProps) {
  const cls = ['ed', inline && 'edi', className].filter(Boolean).join(' ');
  const taRef = useRef<HTMLTextAreaElement>(null);
  const exporting = useUi((s) => s.exporting);

  // Auto-grow fallback for browsers without `field-sizing: content`.
  useLayoutEffect(() => {
    const ta = taRef.current;
    if (!ta || supportsFieldSizing) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value, multiline]);

  if (exporting) {
    if (!value.trim()) return null;
    const Tag = printAs ?? (inline ? 'span' : 'p');
    return <Tag className={`${cls} ed-print`} style={style}>{value}</Tag>;
  }

  const common = {
    className: cls,
    style,
    value,
    placeholder,
    'aria-label': label,
    'data-bid': bid,
    'data-sid': sid,
    onKeyDown,
    spellCheck: true,
  };

  if (multiline) {
    return <textarea ref={taRef} rows={rows} {...common} onChange={(e) => onChange(e.target.value)} />;
  }
  return <input type="text" {...common} onChange={(e) => onChange(e.target.value)} />;
}
