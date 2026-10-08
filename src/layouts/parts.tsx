/**
 * Building blocks shared by the ten layouts. A layout file should read like the
 * matching <!-- ===== Lxx ===== --> block in design-reference/Main.dc.html.
 *
 * Styling rule: anything with the `.ed` class gets its look from the `style` prop.
 * `.ed` is unlayered CSS, so it beats Tailwind utilities (font, width, padding).
 * Plain containers use Tailwind classes.
 */
import { useContext, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type Modifier } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Editable } from '../components/Editable';
import { PageScale } from '../components/Page';
import { bulletId, onBulletKey, onSkillKey, skillId } from '../lib/listKeys';
import { useUi } from '../store/ui';
import { useResume, type Basics, type EduItem, type EditableField, type ExpItem, type ListItem, type ListKey, type ProjectItem, type Titles } from '../store/resume';

/** Theme colors (CSS variables set on the page root). */
export const P = 'var(--theme-primary)';
export const S = 'var(--theme-secondary)';
export const TINT = 'var(--theme-tint)';

interface FieldLook {
  className?: string;
  style?: CSSProperties;
  inline?: boolean;
  multiline?: boolean;
  rows?: number;
}

/* ---------- fields ---------- */

export function Basic({ k, ph, label, ...look }: { k: keyof Basics; ph: string; label: string } & FieldLook) {
  const v = useResume((s) => s.basics[k]);
  const set = useResume((s) => s.setBasic);
  // the name is the document's <h1>; headline gets a hook for print letter-spacing
  const className = k === 'headline' ? ['headline', look.className].filter(Boolean).join(' ') : look.className;
  return <Editable value={v} onChange={(x) => set(k, x)} placeholder={ph} label={label} printAs={k === 'fullName' ? 'h1' : undefined} {...look} className={className} />;
}

/** Editable section title (an <h2> in the exported PDF). */
export function Title({ k, ph = 'Section title', ...look }: { k: keyof Titles; ph?: string } & FieldLook) {
  const v = useResume((s) => s.titles[k]);
  const set = useResume((s) => s.setTitle);
  return <Editable value={v} onChange={(x) => set(k, x)} placeholder={ph} label="Section title" printAs="h2" {...look} />;
}

/** A field of a list item (role, degree, project name…). */
export function Fld<K extends ListKey>({ list, item, k, ph, label, ...look }: { list: K; item: ListItem<K>; k: EditableField<K>; ph: string; label: string } & FieldLook) {
  const set = useResume((s) => s.setItemField);
  return <Editable value={item[k] as string} onChange={(x) => set(list, item.id, k, x)} placeholder={ph} label={label} {...look} />;
}

type FieldProps<K extends ListKey> = { k: EditableField<K>; ph: string; label: string } & FieldLook;
/** Role field. */
export const XF = ({ x, ...p }: { x: ExpItem } & FieldProps<'exp'>) => <Fld list="exp" item={x} {...p} />;
/** Education field. */
export const EF = ({ x, ...p }: { x: EduItem } & FieldProps<'edu'>) => <Fld list="edu" item={x} {...p} />;
/** Project field. */
export const PF = ({ x, ...p }: { x: ProjectItem } & FieldProps<'projects'>) => <Fld list="projects" item={x} {...p} />;

/* font stacks used by the layouts */
/** Hedvig Letters Serif ships one weight (400) and no italic: never let the browser fake them. */
export const SERIF: CSSProperties = { fontFamily: "'Hedvig Letters Serif',Georgia,serif", fontWeight: 400, fontStyle: 'normal', fontSynthesis: 'none' };
/** Display face for the L06–L10 names, headlines and section titles. */
export const HANKEN = "'Hanken Grotesk',sans-serif";
export const UI = "'Inclusive Sans',sans-serif";

/** Achievement bullets of one role. Enter adds, Backspace on empty removes. */
export function Bullets({ x, ph, marker, markerStyle, className, style }: { x: ExpItem; ph: string; marker: string | ReactElement; markerStyle?: CSSProperties; className?: string; style?: CSSProperties }) {
  const setBullet = useResume((s) => s.setBullet);
  const exporting = useUi((s) => s.exporting);
  const mark = typeof marker === 'string' ? <span aria-hidden="true" style={markerStyle}>{marker}</span> : marker;
  if (exporting) {
    // real list for ATS: <ul><li>, empty bullets dropped
    const filled = x.bullets.filter((b) => b.trim());
    if (!filled.length) return null;
    return (
      <ul className={['flex flex-col', className].filter(Boolean).join(' ')} style={style}>
        {filled.map((b, j) => (
          <li key={j} className="bul">
            {mark}
            <span className="ed ed-print">{b}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')} style={style}>
      {x.bullets.map((b, j) => (
        <div key={j} className={b ? 'bul' : 'bul is-empty'}>
          {mark}
          <Editable multiline bid={bulletId(x.id, j)} value={b} onChange={(v) => setBullet(x.id, j, v)} onKeyDown={(e) => onBulletKey(e, x.id, j)} placeholder={ph} label="Achievement" />
        </div>
      ))}
    </div>
  );
}

/** Skill chips plus the "+ Skill" button. Enter adds, Backspace on empty removes. */
export function Skills({ ph, chipClass, chipStyle, label = 'Skill' }: { ph: string; chipClass?: string; chipStyle?: CSSProperties; label?: string }) {
  const skills = useResume((s) => s.skills);
  const set = useResume((s) => s.setItemField);
  const add = useResume((s) => s.addItem);
  return (
    <div className="chips">
      {skills.map((k, i) => (
        <span key={k.id} className={['chipw', !k.v && 'is-empty', chipClass].filter(Boolean).join(' ')} style={chipStyle}>
          <Editable inline sid={skillId(i)} value={k.v} onChange={(v) => set('skills', k.id, 'v', v)} onKeyDown={(e) => onSkillKey(e, i)} placeholder={ph} label={label} />
        </span>
      ))}
      <button type="button" className="add" style={{ marginTop: 0 }} onClick={() => add('skills')}>+ Skill</button>
    </div>
  );
}

/** Dashed "+ Add …" button under a list. */
export function Add({ list, children, style }: { list: Exclude<ListKey, 'skills'>; children: ReactNode; style?: CSSProperties }) {
  const add = useResume((s) => s.addItem);
  return <button type="button" className="add" style={style} onClick={() => add(list)}>{children}</button>;
}

/* ---------- sortable item lists ---------- */

export type Moves = 'vertical' | 'horizontal' | false;

interface ItemsProps<K extends Exclude<ListKey, 'skills'>> {
  list: K;
  /** Reorder axis for the ↑↓ / ←→ buttons and drag. false = delete only. */
  moves?: Moves;
  /** Items sit in a multi-column grid (drag in 2D). */
  grid?: boolean;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  /** Extra positioning for the hover controls. */
  ctlStyle?: CSSProperties;
  children: (item: ListItem<K>, i: number) => ReactNode;
}

/**
 * Renders each item of a list as an `.item` with hover controls:
 * drag handle (dnd-kit), + bullet (roles), move, delete.
 * Items are emitted as siblings so the parent element decides the grid.
 */
export function Items<K extends Exclude<ListKey, 'skills'>>({ list, moves = 'vertical', grid, itemClassName, itemStyle, ctlStyle, children }: ItemsProps<K>) {
  const items = useResume((s) => s[list]) as ListItem<K>[];
  const moveItem = useResume((s) => s.moveItem);
  const scale = useContext(PageScale);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  // The page is transform-scaled: convert screen deltas back to paper pixels.
  const toPaper: Modifier = ({ transform }) => ({
    ...transform,
    x: grid || moves === 'horizontal' ? transform.x / scale : 0,
    y: transform.y / scale,
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((x) => x.id === active.id);
    const to = items.findIndex((x) => x.id === over.id);
    if (from >= 0 && to >= 0) moveItem(list, from, to);
  };

  const ids = items.map((x) => x.id);
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} modifiers={[toPaper]} onDragEnd={onDragEnd} accessibility={{ container: document.body }}>
      <SortableContext items={ids} strategy={grid || moves === 'horizontal' ? rectSortingStrategy : verticalListSortingStrategy} disabled={!moves}>
        {items.map((item, i) => (
          <SortableItem key={item.id} list={list} id={item.id} index={i} count={items.length} moves={moves} className={itemClassName} style={itemStyle} ctlStyle={ctlStyle}>
            {children(item, i)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ list, id, index, count, moves, className, style, ctlStyle, children }: { list: Exclude<ListKey, 'skills'>; id: string; index: number; count: number; moves: Moves; className?: string; style?: CSSProperties; ctlStyle?: CSSProperties; children: ReactNode }) {
  const { setNodeRef, setActivatorNodeRef, listeners, transform, transition, isDragging } = useSortable({ id, disabled: !moves });
  const { moveItem, removeItem, addBullet } = useResume.getState();
  const h = moves === 'horizontal';

  return (
    <div
      ref={setNodeRef}
      className={['item', isDragging && 'is-dragging', className].filter(Boolean).join(' ')}
      style={{ ...style, transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 5 : undefined }}
    >
      <div className="rowctl" style={ctlStyle}>
        {moves && (
          <button type="button" className="ctl grab" ref={setActivatorNodeRef} {...listeners} tabIndex={-1} aria-label="Drag to reorder" title="Drag to reorder">⠿</button>
        )}
        {list === 'exp' && <button type="button" className="ctl" onClick={() => addBullet(id)} aria-label="Add bullet">+</button>}
        {moves && (
          <>
            <button type="button" className="ctl" onClick={() => moveItem(list, index, index - 1)} disabled={index === 0} aria-label={h ? 'Move left' : 'Move up'}>{h ? '←' : '↑'}</button>
            <button type="button" className="ctl" onClick={() => moveItem(list, index, index + 1)} disabled={index === count - 1} aria-label={h ? 'Move right' : 'Move down'}>{h ? '→' : '↓'}</button>
          </>
        )}
        <button type="button" className="ctl" onClick={() => removeItem(list, id)} aria-label={list === 'exp' ? 'Delete role' : 'Delete'}>×</button>
      </div>
      {children}
    </div>
  );
}
