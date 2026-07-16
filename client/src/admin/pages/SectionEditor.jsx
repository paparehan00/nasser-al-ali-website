import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { adminApi, ApiError } from "../api.js";
import { useToast } from "../ToastContext.jsx";
import BilingualField from "../components/BilingualField.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";

const EMPTY_SECTION = {
  key: "",
  overline: { en: "", ar: "" },
  title: { en: "", ar: "" },
  lede: { en: "", ar: "" },
  extra: {},
};

export default function SectionEditor() {
  const { key } = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState(EMPTY_SECTION);
  const [items, setItems] = useState([]);
  const [extraText, setExtraText] = useState("{}");
  const [extraError, setExtraError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, index }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSection(key);
      setSection(res.section);
      setItems(res.items);
      setExtraText(JSON.stringify(res.section.extra ?? {}, null, 2));
      setExtraError("");
      setDirty(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load section");
    } finally {
      setLoading(false);
    }
  }, [key, toast]);

  useEffect(() => { load(); }, [load]);

  const patchSection = (updater) => {
    setSection((cur) => ({ ...cur, ...updater(cur) }));
    setDirty(true);
  };

  const onExtraChange = (e) => {
    setExtraText(e.target.value);
    setDirty(true);
    try {
      JSON.parse(e.target.value || "{}");
      setExtraError("");
    } catch (err) {
      setExtraError(err.message);
    }
  };

  const saveHeader = async () => {
    if (extraError) return toast.error("Fix the extra JSON before saving.");
    setSaving(true);
    try {
      const extra = JSON.parse(extraText || "{}");
      const { section: fresh } = await adminApi.saveSection(key, {
        overline: section.overline,
        title: section.title,
        lede: section.lede,
        extra,
      });
      setSection(fresh);
      setExtraText(JSON.stringify(fresh.extra ?? {}, null, 2));
      setDirty(false);
      toast.success("Section header saved.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addItem = async () => {
    try {
      const { item } = await adminApi.addItem(key, { imagePath: null, data: {} });
      setItems((cur) => [...cur, item]);
      toast.success("Item added at end.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Add failed");
    }
  };

  const askDelete = (item, index) => setConfirmDelete({ id: item.id, index });
  const cancelDelete = () => setConfirmDelete(null);
  const doDelete = async () => {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    try {
      await adminApi.deleteItem(id);
      setItems((cur) => cur.filter((i) => i.id !== id));
      toast.success("Item deleted.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  const updateItemLocal = (id, patch) => {
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch, _dirty: true } : it)));
  };

  const saveItem = async (item) => {
    try {
      const { item: fresh } = await adminApi.saveItem(item.id, {
        imagePath: item.imagePath ?? null,
        data: item.data ?? {},
      });
      setItems((cur) => cur.map((it) => (it.id === fresh.id ? fresh : it)));
      toast.success("Item saved.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    }
  };

  // Drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = async (evt) => {
    const { active, over } = evt;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => String(i.id) === String(active.id));
    const newIndex = items.findIndex((i) => String(i.id) === String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    try {
      await adminApi.reorderItems(key, next.map((i) => i.id));
    } catch (err) {
      toast.error("Reorder failed — reverting.");
      load();
    }
  };

  const itemIds = useMemo(() => items.map((i) => String(i.id)), [items]);

  if (loading) return <div className="naa-admin-loading">Loading {key}…</div>;

  return (
    <div className="naa-admin-editor">
      <header className="naa-admin-pagehead">
        <h1>{section.title.en || key}</h1>
        <p className="naa-admin-crumb">
          <code>{key}</code> · {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </header>

      {/* Section header */}
      <section className="naa-admin-card">
        <h2>Section header</h2>
        <BilingualField label="Overline" value={section.overline} onChange={(v) => patchSection(() => ({ overline: v }))} />
        <BilingualField label="Title"    value={section.title}    onChange={(v) => patchSection(() => ({ title: v }))} />
        <BilingualField label="Lede"     value={section.lede}     onChange={(v) => patchSection(() => ({ lede: v }))} multiline rows={4} />

        <div className="naa-admin-field">
          <label htmlFor="section-extra">Extras (JSON — buttons, KPIs, chairman paragraphs, etc.)</label>
          <textarea
            id="section-extra"
            className={"naa-admin-json" + (extraError ? " naa-admin-json-err" : "")}
            rows={Math.min(20, Math.max(6, (extraText.match(/\n/g)?.length ?? 0) + 1))}
            value={extraText}
            onChange={onExtraChange}
            spellCheck={false}
          />
          {extraError && <div className="naa-admin-inline-err">{extraError}</div>}
        </div>

        <div className="naa-admin-actions-row">
          <button
            type="button"
            className="naa-admin-btn naa-admin-btn-primary"
            onClick={saveHeader}
            disabled={saving || !dirty || !!extraError}
          >
            {saving ? "Saving…" : dirty ? "Save section header" : "Saved"}
          </button>
          {dirty && (
            <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={load} disabled={saving}>
              Discard changes
            </button>
          )}
        </div>
      </section>

      {/* Items */}
      <section className="naa-admin-card">
        <div className="naa-admin-row-between">
          <h2>Items</h2>
          <button type="button" className="naa-admin-btn naa-admin-btn-primary" onClick={addItem}>
            + Add item
          </button>
        </div>

        {items.length === 0 && (
          <div className="naa-admin-empty">
            This section has no items. Some sections (Hero, Chairman, Numbers) are singletons — they only need the section header + extras above.
          </div>
        )}

        {items.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              <ul className="naa-admin-itemlist">
                {items.map((it, i) => (
                  <ItemRow
                    key={it.id}
                    index={i}
                    item={it}
                    sectionKey={key}
                    onChange={(patch) => updateItemLocal(it.id, patch)}
                    onSave={() => saveItem(it)}
                    onDelete={() => askDelete(it, i)}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </section>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this item?"
        message={confirmDelete ? `Item #${confirmDelete.id} will be permanently removed from ${key}.` : ""}
        onCancel={cancelDelete}
        onConfirm={doDelete}
      />
    </div>
  );
}

function ItemRow({ item, index, sectionKey, onChange, onSave, onDelete }) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: String(item.id) });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const [dataText, setDataText] = useState(() => JSON.stringify(item.data ?? {}, null, 2));
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    // If saved from outside (fresh response), resync the JSON textarea.
    if (!item._dirty) setDataText(JSON.stringify(item.data ?? {}, null, 2));
  }, [item.data, item._dirty]);

  const onDataChange = (e) => {
    const text = e.target.value;
    setDataText(text);
    try {
      const parsed = JSON.parse(text || "{}");
      setDataError("");
      onChange({ data: parsed });
    } catch (err) {
      setDataError(err.message);
    }
  };

  // ImageUpload calls back with either a new /uploads/... path (from server)
  // or null when the user clears it. Mark the row dirty so the Save button
  // enables — actual persist happens on the row's Save click.
  const onImageChange = (newPath) => onChange({ imagePath: newPath });

  return (
    <li ref={setNodeRef} style={style} className="naa-admin-item">
      <div className="naa-admin-item-head">
        <button
          type="button"
          className="naa-admin-drag"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >⋮⋮</button>
        <div className="naa-admin-item-title">
          #{index + 1} · id {item.id}
        </div>
        <div className="naa-admin-item-actions">
          <button type="button" className="naa-admin-btn naa-admin-btn-primary" onClick={onSave} disabled={!!dataError || !item._dirty}>
            {item._dirty ? "Save" : "Saved"}
          </button>
          <button type="button" className="naa-admin-btn naa-admin-btn-danger-outline" onClick={onDelete}>Delete</button>
        </div>
      </div>

      <ImageUpload
        sectionKey={sectionKey}
        value={item.imagePath}
        onChange={onImageChange}
      />

      <details className="naa-admin-imgpath-details">
        <summary>Advanced: image path override</summary>
        <input
          type="text"
          className="naa-admin-imgpath-input"
          value={item.imagePath ?? ""}
          onChange={(e) => onChange({ imagePath: e.target.value || null })}
          placeholder="/assets/…  or  /uploads/…"
        />
      </details>

      <label className="naa-admin-field">
        <span>Data (JSON)</span>
        <textarea
          className={"naa-admin-json" + (dataError ? " naa-admin-json-err" : "")}
          rows={Math.min(16, Math.max(3, (dataText.match(/\n/g)?.length ?? 0) + 1))}
          value={dataText}
          onChange={onDataChange}
          spellCheck={false}
        />
        {dataError && <div className="naa-admin-inline-err">{dataError}</div>}
      </label>
    </li>
  );
}
