import { useEffect, useState } from "react";

// In-memory cache so a section fetched by one component is instantly
// available to another mounted later in the same session. The `/api/content/*`
// route sets Cache-Control: max-age=60 so this is just a small perf sugar
// on top; edits made in the admin panel will still land on the next reload.
const cache = new Map();

/**
 * useContent("services") -> { loading, data, error, refresh }
 *
 * data shape:
 *   {
 *     section: { key, overline:{en,ar}, title:{en,ar}, lede:{en,ar}, extra:{...} },
 *     items:   [{ id, sortOrder, imagePath, data:{...} }]
 *   }
 */
export function useContent(sectionKey) {
  const [state, setState] = useState(() => ({
    loading: !cache.has(sectionKey),
    data: cache.get(sectionKey) || null,
    error: null,
  }));

  useEffect(() => {
    if (!sectionKey) return;

    let cancelled = false;

    if (cache.has(sectionKey)) {
      setState({ loading: false, data: cache.get(sectionKey), error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetch(`/api/content/${sectionKey}`, { credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (cancelled) return;
        cache.set(sectionKey, json);
        setState({ loading: false, data: json, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ loading: false, data: null, error: err });
      });

    return () => { cancelled = true; };
  }, [sectionKey]);

  const refresh = () => {
    cache.delete(sectionKey);
    setState({ loading: true, data: null, error: null });
  };

  return { ...state, refresh };
}

/** Read `{en, ar}` field with English fallback. */
export function pickLang(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
}
