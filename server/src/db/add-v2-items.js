/**
 * Idempotent migration: adds new project + client items to the live DB.
 * Safe to run multiple times — skips items whose imagePath already exists.
 * Run: node src/db/add-v2-items.js   (from server/)
 */
import "dotenv/config";
import { db } from "./connection.js";

function addItem(sectionKey, sortOrder, imagePath, data) {
  const existing = db
    .prepare("SELECT id FROM content_items WHERE section_key = ? AND image_path = ?")
    .get(sectionKey, imagePath);
  if (existing) {
    console.log(`  skip (exists) [${sectionKey}] ${imagePath}`);
    return;
  }
  db.prepare(
    "INSERT INTO content_items (section_key, sort_order, image_path, data) VALUES (?, ?, ?, ?)"
  ).run(sectionKey, sortOrder, imagePath, JSON.stringify(data));
  console.log(`  added [${sectionKey}] ${data.name || imagePath}`);
}

// ── Featured Projects ──────────────────────────────────────────────────────
// New items prepended (sort_order 0-4 so they appear first in the carousel).
// The existing 10 items had no explicit sort_order set — they'll follow after.
console.log("\nProjects:");
addItem("projects", 0, "/assets/project-doha-metro-gold-line.webp", {
  name: "Doha Metro Gold Line",
  location: "Doha, Qatar",
  featured: false,
  latest: true,
});
addItem("projects", 1, "/assets/project-doha-metro-overview.jpg", {
  name: "Doha Metro Gold Line – Surface Works",
  location: "Doha, Qatar",
  featured: false,
  latest: false,
});
addItem("projects", 2, "/assets/project-ras-laffan-rlpp1.jpg", {
  name: "Ras Laffan Industrial City – RLPP Phase 1",
  location: "Ras Laffan, Qatar",
  featured: false,
  latest: false,
});
addItem("projects", 3, "/assets/project-ras-laffan-rlpp2.jpg", {
  name: "Ras Laffan Industrial City – RLPP Phase 2",
  location: "Ras Laffan, Qatar",
  featured: false,
  latest: false,
});
addItem("projects", 4, "/assets/project-dukhan-air-base.jpg", {
  name: "Dukhan Air Base",
  location: "Al Rayyan, Qatar",
  featured: false,
  latest: false,
});

// ── Trusted Partners (Clients) ─────────────────────────────────────────────
console.log("\nClients:");
addItem("clients", 999, "/assets/doha-metro.svg", { name: "Doha Metro" });
addItem("clients", 999, "/assets/hamad-intl-airport.jpg", { name: "Hamad International Airport" });
addItem("clients", 999, "/assets/samsung-ct.jpg", { name: "Samsung C&T" });
addItem("clients", 999, "/assets/gulf-asia-contracting-v2.jpg", { name: "Gulf Asia Contracting" });

console.log("\nDone.\n");
