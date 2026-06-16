import React, { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { HiPencilSquare, HiTrash, HiPlus, HiXMark, HiChevronDown, HiChevronRight } from "react-icons/hi2";
import ConfirmModal from "../components/ConfirmModal";

interface Menu {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  menu_id: string;
  label: string;
  link: string;
  parent: string;
  sort: number | string;
  class: string;
}

const AdminMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [menuName, setMenuName] = useState("");
  const [form, setForm] = useState({ label: "", link: "", parent: "", sort: "", class: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "item" | "menu" } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMenus = async () => {
    try {
      const res = await customFetch.get("/admin-menus");
      setMenus(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchItems = async (menuId: string) => {
    try {
      const res = await customFetch.get("/admin-menu-items");
      const filtered = res.data.filter((it: MenuItem) => it.menu_id === menuId);
      setItems(filtered);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleSelectMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    fetchItems(menu.id);
  };

  const resetForm = () => {
    setForm({ label: "", link: "", parent: "", sort: "", class: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      label: item.label, link: item.link, parent: item.parent || "",
      sort: String(item.sort || ""), class: item.class || "",
    });
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === "menu") {
        await customFetch.delete(`/admin-menus/${deleteTarget.id}`);
        toast.success("Menu deleted");
        if (selectedMenu?.id === deleteTarget.id) {
          setSelectedMenu(null);
          setItems([]);
        }
        fetchMenus();
      } else {
        await customFetch.delete(`/admin-menu-items/${deleteTarget.id}`);
        toast.success("Menu item deleted");
        if (selectedMenu) fetchItems(selectedMenu.id);
      }
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(false); setDeleteTarget(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenu) return;
    const payload = { ...form, menu_id: selectedMenu.id, sort: Number(form.sort) || 0 };
    try {
      if (editing) {
        await customFetch.put(`/admin-menu-items/${editing.id}`, payload);
        toast.success("Menu item updated");
      } else {
        await customFetch.post("/admin-menu-items", payload);
        toast.success("Menu item added");
      }
      resetForm();
      fetchItems(selectedMenu.id);
    } catch { toast.error("Something went wrong"); }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customFetch.post("/admin-menus", { name: menuName });
      toast.success("Menu created");
      setMenuName("");
      setShowMenuForm(false);
      fetchMenus();
    } catch { toast.error("Failed to create menu"); }
  };

  const parentOptions = items.filter((it) => it.id !== editing?.id);

  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (id: string) => {
    setExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const treeItems = items.filter((it) => !it.parent || it.parent === "");
  const childrenOf = (parentId: string) => items.filter((it) => it.parent === parentId);

  const renderTree = (parentId: string, depth: number = 0): React.ReactNode[] => {
    const children = childrenOf(parentId);
    if (children.length === 0) return [];
    const result: React.ReactNode[] = [];
    children.forEach((child) => {
      const hasSubChildren = childrenOf(child.id).length > 0;
      result.push(
        <tr key={child.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa]">
          <td className="py-3 px-5 font-medium text-[#202223]" style={{ paddingLeft: `${20 + depth * 20}px` }}>
            {depth > 0 && <span className="text-[#6d7175] mr-1">└─ </span>}
            {hasSubChildren && (
              <button onClick={() => toggleExpand(child.id)} className="mr-1 align-middle">
                {expandedMenus[child.id] ? <HiChevronDown className="text-xs inline" /> : <HiChevronRight className="text-xs inline" />}
              </button>
            )}
            {child.label}
          </td>
          <td className="py-3 px-5 text-[#6d7175]">{child.link}</td>
          <td className="py-3 px-5 text-[#6d7175]">{child.class || "—"}</td>
          <td className="py-3 px-5 text-right">
            <div className="flex justify-end gap-1">
              <button onClick={() => handleEdit(child)}
                className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#2c6ecb]">
                <HiPencilSquare className="text-base" />
              </button>
              <button onClick={() => setDeleteTarget({ id: child.id, type: "item" })}
                className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d]">
                <HiTrash className="text-base" />
              </button>
            </div>
          </td>
        </tr>
      );
      if (expandedMenus[child.id] && hasSubChildren) {
        result.push(...renderTree(child.id, depth + 1));
      }
    });
    return result;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#202223]">Menus</h1>
        <button
          onClick={() => { setMenuName(""); setShowMenuForm(true); }}
          className="flex items-center gap-2 bg-[#008060] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#006e52] transition-colors"
        >
          <HiPlus className="text-lg" />
          Add Menu
        </button>
      </div>

      {showMenuForm && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowMenuForm(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
              <h2 className="text-base font-semibold text-[#202223]">Add Menu</h2>
              <button onClick={() => setShowMenuForm(false)} className="text-[#6d7175] hover:text-[#202223]">
                <HiXMark className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleAddMenu} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#202223] mb-1">Menu Name</label>
                <input type="text" required value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                >
                  Add Menu
                </button>
                <button type="button" onClick={() => setShowMenuForm(false)}
                  className="border border-[#e0e0e0] text-sm font-medium px-6 py-2.5 rounded-lg text-[#6d7175] hover:bg-[#f1f1f1] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        {menus.map((menu) => (
          <button key={menu.id}
            onClick={() => handleSelectMenu(menu)}
            className={`text-left px-4 py-3 rounded-lg border transition-colors text-sm font-medium ${
              selectedMenu?.id === menu.id
                ? "border-[#008060] bg-[#f1f8f5] text-[#008060]"
                : "border-[#e0e0e0] text-[#202223] hover:bg-[#fafafa]"
            }`}
          >
            <div>{menu.name}</div>
            <div className="text-xs text-[#6d7175] font-normal mt-1">
              {selectedMenu?.id === menu.id ? `${items.length} items` : "Click to view"}
            </div>
          </button>
        ))}
      </div>

      {selectedMenu && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#202223]">Items for: {selectedMenu.name}</h2>
            <div className="flex gap-2">
              <button onClick={() => setDeleteTarget({ id: selectedMenu.id, type: "menu" })}
                className="flex items-center gap-1 border border-[#e0e0e0] text-sm font-medium px-3 py-1.5 rounded-lg text-[#d72c0d] hover:bg-[#fef1ee] transition-colors"
              >
                <HiTrash className="text-sm" />
                Delete Menu
              </button>
              <button onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-1 bg-[#008060] text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-[#006e52] transition-colors"
              >
                <HiPlus className="text-sm" />
                Add Item
              </button>
            </div>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-black/20" onClick={resetForm} />
              <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0e0]">
                  <h2 className="text-base font-semibold text-[#202223]">
                    {editing ? "Edit Menu Item" : "Add Menu Item"}
                  </h2>
                  <button onClick={resetForm} className="text-[#6d7175] hover:text-[#202223]">
                    <HiXMark className="text-xl" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#202223] mb-1">Label</label>
                    <input type="text" required value={form.label}
                      onChange={(e) => setForm({ ...form, label: e.target.value })}
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202223] mb-1">Link</label>
                    <input type="text" required value={form.link}
                      onChange={(e) => setForm({ ...form, link: e.target.value })}
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#202223] mb-1">Parent Item</label>
                    <select value={form.parent}
                      onChange={(e) => setForm({ ...form, parent: e.target.value })}
                      className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb] bg-white"
                    >
                      <option value="">None (top level)</option>
                      {parentOptions.map((it) => (
                        <option key={it.id} value={it.id}>{it.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#202223] mb-1">Sort Order</label>
                      <input type="number" value={form.sort}
                        onChange={(e) => setForm({ ...form, sort: e.target.value })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202223] mb-1">CSS Class</label>
                      <input type="text" value={form.class}
                        onChange={(e) => setForm({ ...form, class: e.target.value })}
                        className="w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit"
                      className="bg-[#008060] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#006e52] transition-colors"
                    >
                      {editing ? "Update" : "Add Item"}
                    </button>
                    <button type="button" onClick={resetForm}
                      className="border border-[#e0e0e0] text-sm font-medium px-6 py-2.5 rounded-lg text-[#6d7175] hover:bg-[#f1f1f1] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#fafafa]">
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Label</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Link</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">CSS Class</th>
                  <th className="text-right py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treeItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-[#6d7175]">No items in this menu.</td>
                  </tr>
                )}
                {treeItems.flatMap((parent) => {
                  const hasChildren = childrenOf(parent.id).length > 0;
                  const rows: React.ReactNode[] = [
                    <tr key={parent.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa]">
                      <td className="py-3 px-5 font-medium text-[#202223]">
                        <button onClick={() => toggleExpand(parent.id)} className="mr-1 align-middle">
                          {hasChildren ? (
                            expandedMenus[parent.id] ? <HiChevronDown className="text-xs inline" /> : <HiChevronRight className="text-xs inline" />
                          ) : <span className="inline-block w-3" />}
                        </button>
                        {parent.label}
                      </td>
                      <td className="py-3 px-5 text-[#6d7175]">{parent.link}</td>
                      <td className="py-3 px-5 text-[#6d7175]">{parent.class || "—"}</td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEdit(parent)}
                            className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#2c6ecb]">
                            <HiPencilSquare className="text-base" />
                          </button>
                          <button onClick={() => setDeleteTarget({ id: parent.id, type: "item" })}
                            className="p-1.5 hover:bg-[#f1f1f1] rounded text-[#6d7175] hover:text-[#d72c0d]">
                            <HiTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>,
                  ];
                  if (expandedMenus[parent.id] && hasChildren) {
                    rows.push(...renderTree(parent.id, 1));
                  }
                  return rows;
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!selectedMenu && (
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-10 text-center">
          <p className="text-sm text-[#6d7175]">Select a menu from above to manage its items.</p>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title={deleteTarget?.type === "menu" ? "Delete menu" : "Delete menu item"}
        description={deleteTarget?.type === "menu" ? "Delete this menu and all its items? This action cannot be undone." : "Delete this menu item? This action cannot be undone."}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminMenus;
