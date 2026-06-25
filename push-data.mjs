import { readFileSync } from "fs";

const API = "https://store-production-3fb2.up.railway.app/api";
const DB_PATH = "src/data/db.json";

const db = JSON.parse(readFileSync(DB_PATH, "utf-8"));

async function get(collection) {
  const res = await fetch(`${API}/${collection}`);
  if (!res.ok) return [];
  return res.json();
}

async function del(collection, id) {
  const res = await fetch(`${API}/${collection}/${id}`, { method: "DELETE" });
  return res.ok;
}

async function post(collection, item) {
  const res = await fetch(`${API}/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const text = await res.text();
    console.log(`  FAILED ${collection}: ${res.status} - ${text.slice(0, 100)}`);
    return null;
  }
  return res.json();
}

async function main() {
  console.log("Pushing db.json data to Railway backend...\n");

  // --- Categories ---
  console.log(`\n--- Categories ---`);
  const existingCats = await get("categories");
  console.log(`  Existing: ${existingCats.length}, deleting...`);
  for (const cat of existingCats) {
    const id = cat.cat_id || cat.id;
    await del("categories", id);
    console.log(`  Deleted category #${id}`);
  }
  const idMap = {};
  for (const cat of db.categories) {
    const created = await post("categories", {
      cat_title: cat.cat_title,
      cat_img: cat.cat_img || "",
    });
    if (created) {
      const newId = created.cat_id || created.id;
      idMap[cat.id] = newId;
      console.log(`  Created: ${cat.cat_title} (old id=${cat.id} -> new id=${newId})`);
    }
  }

  // --- Sub-categories ---
  console.log(`\n--- Sub-categories ---`);
  const existingSubs = await get("sub-categories");
  for (const sub of existingSubs) {
    const id = sub.subcat_id || sub.id;
    await del("sub-categories", id);
  }
  for (const sub of db["sub-categories"]) {
    const newCatId = idMap[sub.cat_id];
    if (!newCatId) {
      console.log(`  SKIP sub-category "${sub.subcat_title}" (no cat mapping for ${sub.cat_id})`);
      continue;
    }
    await post("sub-categories", {
      cat_id: newCatId,
      subcat_title: sub.subcat_title,
      subcat_img: sub.subcat_img || "",
      handle: sub.handle,
      SEOdescription: sub.SEOdescription || "",
      SEOtitle: sub.SEOtitle || "",
    });
    console.log(`  Created: ${sub.subcat_title}`);
  }

  // --- Cat-items ---
  console.log(`\n--- Cat-items ---`);
  const existingItems = await get("cat-items");
  for (const item of existingItems) {
    const id = item.cat_item_id || item.id;
    await del("cat-items", id);
  }
  for (const item of db["cat-items"]) {
    await post("cat-items", {
      subcat_id: item.subcat_id,
      cat_item_title: item.cat_item_title,
      cat_item_img: item.cat_item_img || "",
      handle: item.handle,
      SEOdescription: item.SEOdescription || "",
      SEOtitle: item.SEOtitle || "",
    });
    console.log(`  Created: ${item.cat_item_title}`);
  }

  // --- Nav-items (already match, but update to be safe) ---
  console.log(`\n--- Nav-items ---`);
  const existingNav = await get("nav-items");
  for (const nav of existingNav) {
    await del("nav-items", nav.id);
  }
  for (const nav of db["nav-items"]) {
    await post("nav-items", {
      label: nav.label,
      slug: nav.slug,
      sort_order: nav.sort_order,
    });
    console.log(`  Created: ${nav.label}`);
  }

  // --- Users (skip if email exists) ---
  console.log(`\n--- Users ---`);
  const existingUsers = await get("users");
  const existingEmails = new Set(existingUsers.map((u) => u.email));
  for (const user of db.users) {
    if (existingEmails.has(user.email)) {
      console.log(`  SKIP: ${user.email} (exists)`);
      continue;
    }
    await post("users", {
      name: user.name || "",
      lastname: user.lastname || "",
      email: user.email,
      password: user.password,
    });
    console.log(`  Created: ${user.email}`);
  }

  console.log("\nDone! All db.json data pushed to Railway.");
}

main().catch(console.error);
