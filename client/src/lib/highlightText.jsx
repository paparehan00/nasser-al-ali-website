// Wraps the first occurrence of each given phrase in <strong>, splitting a
// plain string into JSX fragments — used to draw the eye to a couple of key
// facts within a paragraph (e.g. "2005", "5,000+ workforce") the way a
// stat callout would, without breaking the copy into separate stat cards.
export function highlightPhrases(text, phrases) {
  if (!text || !phrases?.length) return text;

  const ranges = [];
  for (const phrase of phrases) {
    if (!phrase) continue;
    const idx = text.indexOf(phrase);
    if (idx === -1) continue;
    ranges.push([idx, idx + phrase.length]);
  }
  if (!ranges.length) return text;

  ranges.sort((a, b) => a[0] - b[0]);
  const nodes = [];
  let cursor = 0;
  ranges.forEach(([start, end], i) => {
    if (start < cursor) return; // overlapping match, skip
    if (start > cursor) nodes.push(text.slice(cursor, start));
    nodes.push(<strong key={i}>{text.slice(start, end)}</strong>);
    cursor = end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
