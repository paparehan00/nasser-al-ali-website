// Per-section image processing rules. Every uploaded image is re-encoded to
// hit these targets; if the encoder can't get under `maxBytes` at the given
// quality, we drop quality in steps until it fits (down to a floor).
//
// Fields:
//   maxWidth   — cap width in pixels; height auto-scales; portraits taller
//                than maxHeight are also capped.
//   format     — output codec ('webp' is smallest for photos; 'jpeg' for hero
//                where compat trumps size).
//   quality    — initial encoder quality (0-100).
//   maxBytes   — target file size ceiling after re-encode.

const POLICIES = {
  hero:           { maxWidth: 1920, maxHeight: 1920, format: "jpeg", quality: 82, maxBytes: 400_000 },
  services:       { maxWidth: 1600, maxHeight: 1600, format: "webp", quality: 80, maxBytes: 300_000 },
  projects:       { maxWidth: 1600, maxHeight: 1600, format: "webp", quality: 80, maxBytes: 300_000 },
  clients:        { maxWidth: 400,  maxHeight: 400,  format: "webp", quality: 82, maxBytes: 60_000 },
  gallery:        { maxWidth: 1600, maxHeight: 1600, format: "webp", quality: 80, maxBytes: 300_000 },
  chairman:       { maxWidth: 800,  maxHeight: 1000, format: "webp", quality: 85, maxBytes: 200_000 },
  certifications: { maxWidth: 1600, maxHeight: 2000, format: "webp", quality: 82, maxBytes: 350_000 },
  awards:         { maxWidth: 1600, maxHeight: 1600, format: "webp", quality: 80, maxBytes: 300_000 },
  reviews:        { maxWidth: 400,  maxHeight: 400,  format: "webp", quality: 82, maxBytes: 60_000 },
  // Singleton sections that don't take images
  stats:    null,
  numbers:  null,
};

// Returns null when the section either doesn't exist or doesn't accept uploads.
// Callers must treat null as "no upload allowed for this section".
export function policyFor(sectionKey) {
  if (!(sectionKey in POLICIES)) return null;
  return POLICIES[sectionKey];
}
