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
import TranslatableField from "../components/TranslatableField.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import StructuredEditor from "../components/StructuredEditor.jsx";
import LivePreview from "../components/LivePreview.jsx";
import { getSchema, getItemDisplayName } from "../sectionSchemas.js";

// ─── Translation helpers ────────────────────────────────────────────────────

// Walk schema fields and collect {path: enText} for all bilingual fields
// that have EN text and are NOT in arManualKeys.
// prefix = e.g. "extra" for extra fields, "" for item fields
function collectBilingualTexts(fields, data, arManualKeys, prefix) {
  const result = {};
  for (const f of fields) {
    const path = prefix ? `${prefix}.${f.key}` : f.key;
    if (f.type === "bilingual" || f.type === "bilingual-textarea") {
      const val = data?.[f.key];
      if (val?.en && !arManualKeys.has(path)) result[path] = val.en;
    } else if (f.type === "repeater") {
      const arr = data?.[f.key];
      if (Array.isArray(arr)) {
        arr.forEach((row, i) => {
          const sub = collectBilingualTexts(f.subFields, row, arManualKeys, `${path}.${i}`);
          Object.assign(result, sub);
        });
      }
    }
  }
  return result;
}

// Deep-set .ar on a bilingual object at dotPath in the data tree
function applyArTranslation(data, dotPath, ar) {
  if (!dotPath) return data;
  const parts = dotPath.split(".");
  if (parts.length === 1) {
    const key = parts[0];
    if (Array.isArray(data)) {
      const arr = [...data];
      arr[Number(key)] = { ...(arr[Number(key)] || {}), ar };
      return arr;
    }
    return { ...data, [key]: { ...(data[key] || {}), ar } };
  }
  const [head, ...rest] = parts;
  if (Array.isArray(data)) {
    const arr = [...data];
    arr[Number(head)] = applyArTranslation(arr[Number(head)] || {}, rest.join("."), ar);
    return arr;
  }
  return { ...data, [head]: applyArTranslation(data[head] || {}, rest.join("."), ar) };
}

function applyArTranslations(data, translations) {
  let result = data;
  for (const [path, ar] of Object.entries(translations)) {
    result = applyArTranslation(result, path, ar);
  }
  return result;
}

// ─── Main component ─────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function SectionEditor() {
  const { key } = useParams();
  const toast  = useToast();
  const schema = getSchema(key);

  // ── Core data ────────────────────────────────────────────────
  const [loading, setLoading]   = useState(true);
  const [section, setSection]   = useState(null);
  const [items, setItems]       = useState([]);

  // ── View: "list" | "settings" | "item" ──────────────────────
  const [view, setView]         = useState("list");

  // ── Section settings draft ────────────────────────────────────
  const [settingsDraft, setSettingsDraft]       = useState(null);
  const [settingsArManual, setSettingsArManual] = useState(new Set());

  // ── Item editor draft ─────────────────────────────────────────
  const [editingItem, setEditingItem]   = useState(null); // null = new
  const [itemDraft, setItemDraft]       = useState({ imagePath: null, data: {} });
  const [itemArManual, setItemArManual] = useState(new Set());

  // ── List pagination / search ─────────────────────────────────
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(0);

  // ── Operation states ─────────────────────────────────────────
  const [saving, setSaving]       = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Live preview ─────────────────────────────────────────────
  const [previewDraft, setPreviewDraft] = useState(null);
  const previewTimer = useRef(null);

  // ─── Load ──────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSection(key);
      setSection(res.section);
      setItems(res.items);
      setView("list");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to load section");
    } finally {
      setLoading(false);
    }
  }, [key, toast]);

  useEffect(() => { load(); }, [load]);

  // ─── Preview debounce ──────────────────────────────────────────
  useEffect(() => {
    if (!section) return;
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      if (view === "settings" && settingsDraft) {
        setPreviewDraft({
          section: {
            ...section,
            overline: settingsDraft.overline,
            title:    settingsDraft.title,
            lede:     settingsDraft.lede,
            extra:    settingsDraft.extra,
          },
          items,
        });
      } else if (view === "item") {
        const previewItems = editingItem
          ? items.map((i) => i.id === editingItem.id ? { ...i, ...itemDraft } : i)
          : [...items, { id: -1, sortOrder: items.length, ...itemDraft }];
        setPreviewDraft({ section, items: previewItems });
      } else {
        setPreviewDraft({ section, items });
      }
    }, 300);
    return () => clearTimeout(previewTimer.current);
  }, [view, section, items, settingsDraft, itemDraft, editingItem]);

  // ─── Navigation helpers ────────────────────────────────────────
  const openSettings = () => {
    if (!section) return;
    setSettingsDraft({
      overline: section.overline || { en: "", ar: "" },
      title:    section.title    || { en: "", ar: "" },
      lede:     section.lede     || { en: "", ar: "" },
      extra:    { ...(section.extra || {}) },
    });
    setSettingsArManual(new Set());
    setView("settings");
  };

  const openItemEditor = (item) => {
    setEditingItem(item || null);
    setItemDraft({
      imagePath: item?.imagePath ?? null,
      data: { ...(item?.data ?? {}) },
    });
    setItemArManual(new Set());
    setView("item");
  };

  const backToList = () => setView("list");

  // ─── Section settings save ────────────────────────────────────
  const saveSettings = async () => {
    if (!settingsDraft || saving) return;
    setSaving(true);
    try {
      // Collect texts to translate
      const toTranslate = {};
      if (settingsDraft.overline?.en && !settingsArManual.has("overline"))
        toTranslate["overline"] = settingsDraft.overline.en;
      if (settingsDraft.title?.en && !settingsArManual.has("title"))
        toTranslate["title"] = settingsDraft.title.en;
      if (settingsDraft.lede?.en && !settingsArManual.has("lede"))
        toTranslate["lede"] = settingsDraft.lede.en;
      Object.assign(toTranslate,
        collectBilingualTexts(schema.extraFields, settingsDraft.extra, settingsArManual, "extra")
      );

      // Translate
      let translations = {};
      if (Object.keys(toTranslate).length > 0) {
        try {
          const r = await adminApi.translate(toTranslate);
          translations = r.translations || {};
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 501)) {
            toast.info("Auto-translation unavailable — saving English content only.");
          }
        }
      }

      // Apply translations to draft
      const updatedOverline = { ...settingsDraft.overline, ...(translations.overline ? { ar: translations.overline } : {}) };
      const updatedTitle    = { ...settingsDraft.title,    ...(translations.title    ? { ar: translations.title    } : {}) };
      const updatedLede     = { ...settingsDraft.lede,     ...(translations.lede     ? { ar: translations.lede     } : {}) };

      const extraTranslations = Object.fromEntries(
        Object.entries(translations)
          .filter(([k]) => k.startsWith("extra."))
          .map(([k, v]) => [k.slice(6), v])
      );
      const updatedExtra = Object.keys(extraTranslations).length > 0
        ? applyArTranslations(settingsDraft.extra, extraTranslations)
        : settingsDraft.extra;

      // Save
      const { section: fresh } = await adminApi.saveSection(key, {
        overline: updatedOverline,
        title:    updatedTitle,
        lede:     updatedLede,
        extra:    updatedExtra,
      });
      setSection(fresh);
      toast.success("Section settings saved.");
      setView("list");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ─── Item save ────────────────────────────────────────────────
  const saveItem = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // Collect texts to translate
      const toTranslate = collectBilingualTexts(schema.itemFields, itemDraft.data, itemArManual, "");

      // Translate
      let translations = {};
      if (Object.keys(toTranslate).length > 0) {
        try {
          const r = await adminApi.translate(toTranslate);
          translations = r.translations || {};
        } catch (err) {
          if (!(err instanceof ApiError && err.status === 501)) {
            toast.info("Auto-translation unavailable — saving English content only.");
          }
        }
      }

      // Apply translations to item data
      const newData = Object.keys(translations).length > 0
        ? applyArTranslations(itemDraft.data, translations)
        : itemDraft.data;

      // Save
      if (editingItem) {
        const { item: fresh } = await adminApi.saveItem(editingItem.id, {
          imagePath: itemDraft.imagePath ?? null,
          data: newData,
        });
        setItems((cur) => cur.map((i) => i.id === fresh.id ? fresh : i));
        toast.success("Item saved.");
      } else {
        const { item: fresh } = await adminApi.addItem(key, {
          imagePath: itemDraft.imagePath ?? null,
          data: newData,
        });
        setItems((cur) => [...cur, fresh]);
        toast.success("Item created.");
      }
      setView("list");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ─── Item delete ──────────────────────────────────────────────
  const doDelete = async () => {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    try {
      await adminApi.deleteItem(id);
      setItems((cur) => cur.filter((i) => i.id !== id));
      if (editingItem?.id === id) backToList();
      toast.success("Item deleted.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Delete failed");
    }
  };

  // ─── Drag & drop reorder ──────────────────────────────────────
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

  // ─── List filtering ────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => JSON.stringify(it.data || {}).toLowerCase().includes(q));
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages - 1);
  const pageItems  = filteredItems.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  // ─── arManual helpers ──────────────────────────────────────────
  const handleSettingsArManual = (path, manual) => {
    setSettingsArManual((prev) => {
      const next = new Set(prev);
      manual ? next.add(path) : next.delete(path);
      return next;
    });
  };

  const handleItemArManual = (path, manual) => {
    setItemArManual((prev) => {
      const next = new Set(prev);
      manual ? next.add(path) : next.delete(path);
      return next;
    });
  };

  // ─── Render ────────────────────────────────────────────────────
  if (loading) return <div className="naa-admin-loading">Loading {key}…</div>;

  const hasItems  = !schema.singleton;
  const hasExtra  = schema.extraFields?.length > 0;
  const editingIdx = editingItem ? items.findIndex((i) => i.id === editingItem.id) : (view === "item" ? items.length : null);

  return (
    <div className="naa-admin-split">
      {/* ── Left pane ── */}
      <div className="naa-admin-split-left">

        {/* ══ LIST VIEW ══ */}
        {view === "list" && (
          <>
            <header className="naa-admin-pagehead">
              <h1>{schema.label || section?.title?.en || key}</h1>
              <p className="naa-admin-crumb">
                <code>{key}</code>
                {hasItems ? ` · ${items.length} item${items.length === 1 ? "" : "s"}` : " · section only"}
              </p>
            </header>

            {/* Section Settings button */}
            <div className="naa-ev-section-settings-row">
              <button type="button" className="naa-admin-btn naa-admin-btn-ghost naa-ev-settings-btn" onClick={openSettings}>
                ⚙ Section Settings
              </button>
              <span className="naa-ev-settings-hint">
                {section?.title?.en ? `"${section.title.en}"` : "Overline, title, intro, shared labels"}
              </span>
            </div>

            {/* Items list */}
            {hasItems && (
              <section className="naa-admin-card">
                <div className="naa-admin-row-between" style={{ marginBottom: 0 }}>
                  <h2 style={{ marginBottom: 0 }}>Items</h2>
                  <button type="button" className="naa-admin-btn naa-admin-btn-primary" onClick={() => openItemEditor(null)}>
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
                      onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    />
                  </div>
                )}

                {filteredItems.length === 0 && (
                  <div className="naa-admin-empty" style={{ marginTop: 16 }}>
                    {search ? "No items match your search." : "No items yet — click \"+ Add item\" to start."}
                  </div>
                )}

                {filteredItems.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                      <ul className="naa-il-list">
                        {pageItems.map((it) => (
                          <ItemRow
                            key={it.id}
                            item={it}
                            schema={schema}
                            onEdit={() => openItemEditor(it)}
                            onDelete={() => setConfirmDelete({ id: it.id, name: getItemDisplayName(it) })}
                            disabled={!!search}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                  </DndContext>
                )}

                {totalPages > 1 && (
                  <div className="naa-il-pager">
                    <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0}>← Prev</button>
                    <span className="naa-il-page-info">{safePage + 1} / {totalPages}</span>
                    <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1}>Next →</button>
                  </div>
                )}
              </section>
            )}

            {/* Singleton sections: show settings inline */}
            {!hasItems && (
              <div className="naa-admin-card naa-ev-singleton-hint">
                <p>This section has no list items. Use <strong>⚙ Section Settings</strong> above to edit its content.</p>
              </div>
            )}
          </>
        )}

        {/* ══ SECTION SETTINGS VIEW ══ */}
        {view === "settings" && settingsDraft && (
          <>
            <header className="naa-admin-pagehead naa-ev-panel-head">
              <button type="button" className="naa-ev-back-btn" onClick={backToList}>← Items</button>
              <h1>Section Settings</h1>
              <p className="naa-admin-crumb">Overline, title, intro, shared labels — applies to the whole section</p>
            </header>

            <section className="naa-admin-card">
              <TranslatableField
                label='Small label above title ("overline")'
                value={settingsDraft.overline}
                onChange={(v) => setSettingsDraft((d) => ({ ...d, overline: v }))}
                arManual={settingsArManual.has("overline")}
                onArManualChange={(m) => handleSettingsArManual("overline", m)}
              />
              <TranslatableField
                label="Section title"
                value={settingsDraft.title}
                onChange={(v) => setSettingsDraft((d) => ({ ...d, title: v }))}
                arManual={settingsArManual.has("title")}
                onArManualChange={(m) => handleSettingsArManual("title", m)}
              />
              <TranslatableField
                label="Intro paragraph (lede)"
                value={settingsDraft.lede}
                onChange={(v) => setSettingsDraft((d) => ({ ...d, lede: v }))}
                multiline
                rows={4}
                arManual={settingsArManual.has("lede")}
                onArManualChange={(m) => handleSettingsArManual("lede", m)}
              />

              {hasExtra && (
                <>
                  <div className="naa-se-extra-divider"><span>Section-specific fields</span></div>
                  <StructuredEditor
                    fields={schema.extraFields}
                    value={settingsDraft.extra ?? {}}
                    onChange={(newExtra) => setSettingsDraft((d) => ({ ...d, extra: newExtra }))}
                    sectionKey={key}
                    arManualKeys={settingsArManual}
                    onArManualChange={handleSettingsArManual}
                    fieldPrefix="extra"
                  />
                </>
              )}

              <div className="naa-admin-actions-row" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="naa-admin-btn naa-admin-btn-primary"
                  onClick={saveSettings}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Section Settings"}
                </button>
                <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={backToList} disabled={saving}>
                  Cancel
                </button>
              </div>
            </section>
          </>
        )}

        {/* ══ ITEM EDITOR VIEW ══ */}
        {view === "item" && (
          <>
            <header className="naa-admin-pagehead naa-ev-panel-head">
              <button type="button" className="naa-ev-back-btn" onClick={backToList}>← Items</button>
              <h1>
                {editingItem
                  ? <>Editing: <strong>{getItemDisplayName(editingItem)}</strong></>
                  : "New item"}
              </h1>
              {editingItem && <p className="naa-admin-crumb">ID #{editingItem.id}</p>}
            </header>

            <section className="naa-admin-card">
              {schema.hasImage && (
                <ImageUpload
                  sectionKey={key}
                  value={itemDraft.imagePath}
                  onChange={(p) => setItemDraft((d) => ({ ...d, imagePath: p }))}
                />
              )}

              {schema.itemFields?.length > 0 && (
                <StructuredEditor
                  fields={schema.itemFields}
                  value={itemDraft.data ?? {}}
                  onChange={(newData) => setItemDraft((d) => ({ ...d, data: newData }))}
                  sectionKey={key}
                  arManualKeys={itemArManual}
                  onArManualChange={handleItemArManual}
                  fieldPrefix=""
                />
              )}

              {schema.hasImage && (
                <details className="naa-admin-imgpath-details">
                  <summary>Advanced: manual image path</summary>
                  <input
                    type="text"
                    className="naa-admin-imgpath-input"
                    value={itemDraft.imagePath ?? ""}
                    onChange={(e) => setItemDraft((d) => ({ ...d, imagePath: e.target.value || null }))}
                    placeholder="/assets/… or /uploads/…"
                  />
                </details>
              )}

              <div className="naa-admin-actions-row" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="naa-admin-btn naa-admin-btn-primary"
                  onClick={saveItem}
                  disabled={saving}
                >
                  {saving ? "Saving…" : editingItem ? "Save item" : "Create item"}
                </button>
                <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={backToList} disabled={saving}>
                  Cancel
                </button>
                {editingItem && (
                  <button
                    type="button"
                    className="naa-admin-btn naa-admin-btn-danger-outline"
                    style={{ marginLeft: "auto" }}
                    onClick={() => setConfirmDelete({ id: editingItem.id, name: getItemDisplayName(editingItem) })}
                    disabled={saving}
                  >
                    Delete item
                  </button>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ── Right pane: live preview ── */}
      <div className="naa-admin-split-right">
        <LivePreview
          sectionKey={key}
          draft={previewDraft}
          editingIdx={editingIdx}
        />
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this item?"
        message={confirmDelete ? `"${confirmDelete.name}" will be permanently removed.` : ""}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}

// ─── Sortable item row ────────────────────────────────────────────────────────
function ItemRow({ item, schema, onEdit, onDelete, disabled }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(item.id),
    disabled,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="naa-il-item"
    >
      {!disabled && (
        <button type="button" className="naa-il-drag" {...attributes} {...listeners} aria-label="Drag to reorder">⋮⋮</button>
      )}
      {schema.hasImage && item.imagePath && (
        <div className="naa-il-thumb">
          <img src={item.imagePath} alt={getItemDisplayName(item)} loading="lazy" onError={(e) => { e.currentTarget.style.opacity = "0.2"; }} />
        </div>
      )}
      <span className="naa-il-name">{getItemDisplayName(item)}</span>
      <div className="naa-il-actions">
        <button type="button" className="naa-admin-btn naa-admin-btn-ghost" onClick={onEdit}>Edit</button>
        <button type="button" className="naa-admin-btn naa-admin-btn-danger-outline" onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}
