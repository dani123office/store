import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customFetch.get("/users");
        setCustomers(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } catch (e) { console.error(e); }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c: any) =>
    (c.name || c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl font-semibold text-[#202223] mb-5">Customers</h1>

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0e0e0]">
          <div className="flex items-center gap-3">
            <button className="px-3 py-1 text-sm font-medium text-[#2c6ecb] bg-[#f1f8fe] rounded-lg border border-[#2c6ecb]">
              All
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded transition-colors ${showSearch ? "bg-blue-50 text-[#2c6ecb]" : "text-[#6d7175] hover:text-[#202223] hover:bg-gray-100"}`}
              title="Search"
            >
              <HiOutlineMagnifyingGlass className="text-lg" />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-5 py-2 border-b border-[#e0e0e0] bg-[#fafafa]">
            <div className="relative max-w-xs">
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] text-sm" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                autoFocus
                className="w-full border border-[#e0e0e0] rounded-lg pl-9 pr-8 py-1.5 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#202223]">
                  <HiXMark className="text-sm" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#e0e0e0]">
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Name</th>
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Email</th>
                <th className="text-left py-3 pl-5 pr-5 text-xs font-semibold tracking-wider text-gray-500 uppercase">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer: any) => (
                <tr key={customer.id} className="border-b border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 pl-5 pr-5 font-medium text-[#202223]">
                    {customer.name || "—"} {customer.lastname || ""}
                  </td>
                  <td className="py-3 pl-5 pr-5 text-[#6d7175]">{customer.email}</td>
                  <td className="py-3 pl-5 pr-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f1f1f1] text-[#6d7175]">
                      {customer.role || "Customer"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-16 text-center text-sm text-[#6d7175]">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
