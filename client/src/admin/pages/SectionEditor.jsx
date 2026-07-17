import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext, closestCenter, PointerSensor,
  KeyboardSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove,
  sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { adminApi, ApiError } from "../api.js";
import { useToast } from "../ToastContext.jsx";
import BilingualField from "../components/BilingualField.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import StructuredEditor from "../components/StructuredEditor.jsx";
import LivePreview from "../components/LivePreview.jsx";
import { getSchema, getItemDisplayName } from "../sectionSchemas.js";

const PAGE_SIZE = 20;

const EMPTY_SECTION = {
  key: "",
  overline: { en: "", ar: "" },
  title:    { en: "", ar: "" },
  lede:     { en: "", ar: "" },
  extra:    {},
};

export default function SectionEditor() {
  const { key } = useParams();
  const toast = useToast();
  const schema = getSchema(key);

  // ── Data ──────────────────────────────────────────────────
  const [loading, setLoading]       = useState(true);
  const [section, setSection]       = useState(EMPTY_SECTION);
  const [items, setItems]           = useState([]);
  const [sectionDirty, setSectionDirty] = useState(false);
  const [saving, setSaving]         = useState(false);

  // ── Item list ─────────────────────────────────────────────
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Item editor ──────────────────────────────────────────
  const [editingId, setEditingId]   = useState(null);
  const [editingDraft, setEditingDraft] = useState(null); // { imagePath, data }
  const [editingDirty, setEditingDirty] = useState(false);
  const [itemSaving, setItemSaving] = useState(false);
  const editPanelRef = useRef(null);

  // ── Live preview ─────────────────────────────────────────
  const [previewDraft, setPreviewDraft] = useState(null);
  const previewTimer = useRef(null);

  // ─────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSection(key);
      setSection(res.section);
      setItems(res.items);
      setSectionDirty(false);
      setEditingId(null);
      setEditingDraft(null);
      setEditingDirty(false);
      setSearch("");
      setPage(0);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load section");
    } finally {
      setLoading(false);
    }
  }, [key, toast]);

  useEffect(() => { load(); }, [load]);

  // Debounce preview updates 300ms after any data change
  const previewItems = useMemo(() => {
    if (!editingId || !editingDraft) return items;
    return items.map((it) =>
      it.id === editingId ? { ...it, ...editingDraft } : it
    );
  }, [items, editingId, editingDraft]);

  useEffect(() => {
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      setPreviewDraft({ section, items: previewItems });
    }, 300);
    return () => clearTimeout(previewTimer.current);
  }, [section, previewItems]);

  // ── Section header mutations ──────────────────────────────
  const patchSection = (updater) => {
    setSection((cur) => ({ ...cur, ...updater(cur) }));
    setSectionDirty(true);
  };

  const saveSection = async () => {
    setSaving(true);
    try {
      const { section: fresh } = await adminApi.saveSection(key, {
        overline: section.overline,
        title:    section.title,
        lede:     section.lede,
        extra:    section.extra,
      });
      setSection(fresh);
      setSectionDirty(false);
      toast.success("Section saved.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Item list helpers ─────────────────────────────────────
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => {
      const d = it.data || {};
      return JSON.stringify(d).toLowerCase().includes(q);
    });
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages - 1);
  const pageItems  = filteredItems.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const onSearch = (e) => { setSearch(e.target.value); setPage(0); };

  // ── Item CRUD ────────────────────────────────────────────
  const addItem = async () => {
    try {
      const { item } = await adminApi.addItem(key, { imagePath: null, data: {} });
      setItems((cur) => [...cur, item]);
      toast.success("Item added.");
      openItemEditor(item);
      // Jump to last page to see the new item
      setSearch("");
      setTimeout(() => {
        const newTotal = Math.ceil((items.length + 1) / PAGE_SIZE);
        setPage(newTotal - 1);
      }, 50);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Add failed");
    }
  };

  const openItemEditor = (item) => {
    if (editingId === item.id) {
      setEditingId(null);
      setEditingDraft(null);
      setEditingDirty(false);
      return;
    }
    setEditingId(item.id);
    setEditingDraft({ imagePath: item.imagePath ?? null, data: { ...(item.data ?? {}) } });
    setEditingDirty(false);
    setTimeout(() => editPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
  };

  const patchEditingDraft = (patch) => {
    setEditingDraft((cur) => ({ ...cur, ...patch }));
    setEditingDirty(true);
  };

  const saveItem = async () => {
    if (!editingId || !editingDraft) return;
    setItemSaving(true);
    try {
      const { item: fresh } = await adminApi.saveItem(editingId, {
        imagePath: editingDraft.imagePath ?? null,
        data:      editingDraft.data ?? {},
      });
      setItems((cur) => cur.map((it) => (it.id === fresh.id ? fresh : it)));
      setEditingDirty(false);
      toast.success("Item saved.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setItemSaving(false);
    }
  };

  const cancelItemEdit = () => {
    setEditingId(null);
    setEditingDraft(null);
    setEditingDirty(false);
  };

  const askDelete = (item) => setConfirmDelete({ id: item.id, name: getItemDisplayName(item) });
  const cancelDelete = () => setConfirmDelete(null);
  const doDelete = async () => {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    if (editingId === id) cancelItemEdit();
    try {
      await adminApi.deleteItem(id);
      setItems((cur) => cur.filter((i) => i.id !== id));
      toast.success("Item deleted.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  // ── Drag & drop reorder ───────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => String(i.id) === String(active.id));
    const newIdx = items.findIndex((i) => String(i.id) === String(over.id));
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(items, oldIdx, newIdx);
    setItems(next);
    try {
      await adminApi.reorderItems(key, next.map((i) => i.id));
    } catch (err) {
      toast.error("Reorder failed — reverting.");
      load();
    }
  };

  const itemIds = useMemo(() => items.map((i) => String(i.id)), [items]);

  // ── Render ────────────────────────────────────────────────
  if (loading) return <div className="naa-admin-loading">Loading {key}…</div>;

  const hasItems = !schema.singleton;
  const hasExtraFields = schema.extraFields?.length > 0;

  return (
    <div className="naa-admin-split">
      {/* ── Left pane: editor ── */}
      <div className="naa-admin-split-left">
        <header className="naa-admin-pagehead">
          <h1>{schema.label || section.title?.en || key}</h1>
          <p className="naa-admin-crumb">
            <code>{key}</code>
            {hasItems ? ` · ${items.length} item${items.length === 1 ? "" : "s"}` : " · section only"}
          </p>
        </header>

        {/* Section header card */}
        <section className="naa-admin-card">
          <h2>Section header</h2>

          <BilingualField
            label='Small label above title ("overline")'
            value={section.overline}
            onChange={(v) => patchSection(() => ({ overline: v }))}
          />
          <BilingualField
            label="Section title"
            value={section.title}
            onChange={(v) => patchSection(() => ({ title: v }))}
          />
          <BilingualField
            label="Intro paragraph (lede)"
            value={section.lede}
            onChange={(v) => patchSection(() => ({ lede: v }))}
            multiline
            rows={4}
          />

          {hasExtraFields && (
            <div className="naa-se-extra-divider">
              <span>Additional fields</span>
            </div>
          )}

          {hasExtraFields && (
            <StructuredEditor
              fields={schema.extraFields}
              value={section.extra ?? {}}
              onChange={(newExtra) => patchSection(() => ({ extra: newExtra }))}
              sectionKey={key}
            />
          )}

          <div className="naa-admin-actions-row" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="naa-admin-btn naa-admin-btn-primary"
              onClick={saveSection}
              disabled={saving || !sectionDirty}
            >
              {saving ? "Saving…" : sectionDirty ? "Save section" : "Saved"}
            </button>
            {sectionDirty && (
              <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={load} disabled={saving}>
                Discard changes
              </button>
            )}
          </div>
        </section>

        {/* Items card */}
        {hasItems && (
          <section className="naa-admin-card">
            <div className="naa-admin-row-between" style={{ marginBottom: 0 }}>
              <h2 style={{ marginBottom: 0 }}>Items</h2>
              <button type="button" className="naa-admin-btn naa-admin-btn-primary" onClick={addItem}>
                + Add item
              </button>
            </div>

            {items.length > PAGE_SIZE && (
              <div className="naa-il-search-row">
                <input
                  type="search"
                  className="naa-il-search"
                  placeholder="Search items…"
                  value={search}
                  onChange={onSearch}
                />
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="naa-admin-empty" style={{ marginTop: 16 }}>
                {search ? "No items match your search." : "No items yet — click \"+ Add item\" to start."}
              </div>
            )}

            {filteredItems.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
              >
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  <ul className="naa-il-list">
                    {pageItems.map((it) => (
                      <ItemRow
                        key={it.id}
                        item={it}
                        schema={schema}
                        isEditing={editingId === it.id}
                        onEdit={() => openItemEditor(it)}
                        onDelete={() => askDelete(it)}
                        disabled={!!search}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}

            {totalPages > 1 && (
              <div className="naa-il-pager">
                <button
                  type="button"
                  className="naa-admin-btn naa-admin-btn-ghost"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage === 0}
                >
                  ← Prev
                </button>
                <span className="naa-il-page-info">
                  {safePage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="naa-admin-btn naa-admin-btn-ghost"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={safePage >= totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Item edit panel */}
            {editingId != null && editingDraft && (
              <div className="naa-ie-panel" ref={editPanelRef}>
                <div className="naa-ie-panel-head">
                  <span className="naa-ie-panel-title">
                    Editing: <strong>{getItemDisplayName(items.find((i) => i.id === editingId) || {})}</strong>
                  </span>
                  <button
                    type="button"
                    className="naa-ie-panel-close"
                    onClick={cancelItemEdit}
                    title="Close editor"
                  >
                    ✕
                  </button>
                </div>

                <div className="naa-ie-panel-body">
                  {schema.hasImage && (
                    <ImageUpload
                      sectionKey={key}
                      value={editingDraft.imagePath}
                      onChange={(p) => patchEditingDraft({ imagePath: p })}
                    />
                  )}

                  {schema.itemFields?.length > 0 && (
                    <StructuredEditor
                      fields={schema.itemFields}
                      value={editingDraft.data ?? {}}
                      onChange={(newData) => patchEditingDraft({ data: newData })}
                      sectionKey={key}
                    />
                  )}

                  {schema.hasImage && (
                    <details className="naa-admin-imgpath-details">
                      <summary>Advanced: manual image path</summary>
                      <input
                        type="text"
                        className="naa-admin-imgpath-input"
                        value={editingDraft.imagePath ?? ""}
                        onChange={(e) => patchEditingDraft({ imagePath: e.target.value || null })}
                        placeholder="/assets/… or /uploads/…"
                      />
                    </details>
                  )}
                </div>

                <div className="naa-ie-panel-foot">
                  <button
                    type="button"
                    className="naa-admin-btn naa-admin-btn-primary"
                    onClick={saveItem}
                    disabled={itemSaving || !editingDirty}
                  >
                    {itemSaving ? "Saving…" : editingDirty ? "Save item" : "Saved"}
                  </button>
                  <button
                    type="button"
                    className="naa-admin-btn naa-admin-btn-ghost"
                    onClick={cancelItemEdit}
                    disabled={itemSaving}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── Right pane: live preview ── */}
      <div className="naa-admin-split-right">
        <LivePreview sectionKey={key} draft={previewDraft} />
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this item?"
        message={confirmDelete ? `"${confirmDelete.name}" will be permanently removed.` : ""}
        onCancel={cancelDelete}
        onConfirm={doDelete}
      />
    </div>
  );
}

// ── Sortable item row in the list ─────────────────────────────────────────────
function ItemRow({ item, schema, isEditing, onEdit, onDelete, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(item.id),
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const displayName = getItemDisplayName(item);

  return (
    <li ref={setNodeRef} style={style} className={"naa-il-item" + (isEditing ? " is-editing" : "")}>
      {!disabled && (
        <button
          type="button"
          className="naa-il-drag"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          ⋮⋮
        </button>
      )}

      {schema.hasImage && item.imagePath && (
        <div className="naa-il-thumb">
          <img
            src={item.imagePath}
            alt={displayName}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.opacity = "0.2"; }}
          />
        </div>
      )}

      <span className="naa-il-name">{displayName}</span>

      <div className="naa-il-actions">
        <button
          type="button"
          className={"naa-admin-btn " + (isEditing ? "naa-admin-btn-ghost" : "naa-admin-btn-ghost")}
          style={isEditing ? { borderColor: "var(--naa-gold)", color: "var(--naa-gold)" } : {}}
          onClick={onEdit}
        >
          {isEditing ? "Close" : "Edit"}
        </button>
        <button
          type="button"
          className="naa-admin-btn naa-admin-btn-danger-outline"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
