import { useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customFetch.get("/users");
        setCustomers(res.data);
      } catch (e) { console.error(e); }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c: any) =>
    (c.name || c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#202223] mb-6">Customers</h1>

      <div className="mb-4 relative max-w-sm">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175] text-lg" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#e0e0e0] rounded-lg pl-10 pr-3 py-2 text-sm outline-none focus:border-[#2c6ecb] focus:ring-1 focus:ring-[#2c6ecb]"
        />
      </div>

      <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Name</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Email</th>
              <th className="text-left py-3 px-5 text-xs font-medium text-[#6d7175] uppercase">Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer: any) => (
              <tr key={customer.id} className="border-t border-[#e0e0e0] hover:bg-[#fafafa]">
                <td className="py-3 px-5 font-medium text-[#202223]">
                  {customer.name || "—"} {customer.lastname || ""}
                </td>
                <td className="py-3 px-5 text-[#6d7175]">{customer.email}</td>
                <td className="py-3 px-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f1f1f1] text-[#6d7175]">
                    {customer.role || "Customer"}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-sm text-[#6d7175]">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
