import { createContext, useContext } from "react";

// Provides { [sectionKey]: { section, items } } — same shape as useContent's data.
// When non-null, useContent() returns this instead of fetching from the API.
// LivePreview wraps real public components in this provider with draft data.
export const ContentOverrideContext = createContext(null);

export function useContentOverrideMap() {
  return useContext(ContentOverrideContext);
}
