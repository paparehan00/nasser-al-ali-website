import { useContext, useEffect, useState } from "react";
import { ContentOverrideContext } from "../contexts/ContentOverrideContext.jsx";

// In-memory cache so a section fetched by one component is instantly
// available to another mounted later in the same session.
const cache = new Map();

/**
 * useContent("services") -> { loading, data, error, refresh }
 *
 * data shape:
 *   {
 *     section: { key, overline:{en,ar}, title:{en,ar}, lede:{en,ar}, extra:{...} },
 *     items:   [{ id, sortOrder, imagePath, data:{...} }]
 *   }
 *
 * If a ContentOverrideContext is present (e.g. inside LivePreview), the
 * override data is returned directly without any fetch.
 */
export function useContent(sectionKey) {
  const overrideMap = useContext(ContentOverrideContext);
  const override = overrideMap?.[sectionKey] ?? null;

  const [state, setState] = useState(() => ({
    loading: !override && !cache.has(sectionKey),
    data: override ?? cache.get(sectionKey) ?? null,
    error: null,
  }));

  useEffect(() => {
    if (override) {
      setState({ loading: false, data: override, error: null });
      return;
    }

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
  }, [sectionKey, override]);

  const refresh = () => {
    cache.delete(sectionKey);
    setState({ loading: true, data: null, error: null });
  };

  if (override) return { loading: false, data: override, error: null, refresh };
  return { ...state, refresh };
}

/** Read `{en, ar}` field with English fallback. */
export function pickLang(field, lang) {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || "";
}
