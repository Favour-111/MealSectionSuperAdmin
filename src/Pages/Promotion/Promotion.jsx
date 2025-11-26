import React, { useEffect, useMemo, useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoAdd } from "react-icons/io5";
import { FiSearch, FiX } from "react-icons/fi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { SlBell } from "react-icons/sl";
import { FaRegEdit } from "react-icons/fa";
import { MdCampaign, MdOutlineContentPasteSearch } from "react-icons/md";
import toast from "react-hot-toast";
import { CardsSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
import { useAppContext } from "../../components/AppContext";

const PROMO_API = `${import.meta.env.VITE_REACT_APP_API}/api/promotions`;

const Promotion = () => {
  const { Universities, vendors } = useAppContext();

  // UI state
  const [openNav, setOpenNav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [promotions, setPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    university: "",
    header: "",
    discount: "",
    text: "",
    duration: "",
    endDate: "",
    status: "active",
    featured: false,
  });

  // Fetch promotions
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await fetch(PROMO_API);
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to fetch promotions");
      setPromotions(Array.isArray(data?.promotions) ? data.promotions : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  // Derived lists
  const filteredVendors = useMemo(() => {
    if (!formData.university) return [];
    return vendors.filter((v) => v.university === formData.university);
  }, [vendors, formData.university]);

  const filteredPromotions = useMemo(() => {
    let list = [...promotions];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.vendorName?.toLowerCase().includes(q) ||
          p.header?.toLowerCase().includes(q) ||
          p.university?.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all")
      list = list.filter((p) => p.status === filterStatus);
    return list;
  }, [promotions, searchQuery, filterStatus]);

  const ongoingCampaigns = filteredPromotions.filter(
    (p) => p.status === "active"
  );
  const completedCampaigns = filteredPromotions.filter(
    (p) => p.status === "completed"
  );
  const featuredPromotions = promotions.filter((p) => p.featured);

  const summaryStats = useMemo(
    () => ({
      total: promotions.length,
      active: promotions.filter((p) => p.status === "active").length,
      completed: promotions.filter((p) => p.status === "completed").length,
      featured: featuredPromotions.length,
    }),
    [promotions, featuredPromotions]
  );

  // Form helpers
  const resetForm = () => {
    setFormData({
      vendorId: "",
      vendorName: "",
      university: "",
      header: "",
      discount: "",
      text: "",
      duration: "",
      endDate: "",
      status: "active",
      featured: false,
    });
    setEditingPromotion(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    const v = vendors.find((x) => x._id === vendorId);
    setFormData((prev) => ({
      ...prev,
      vendorId,
      vendorName: v?.storeName || "",
    }));
  };

  const openCreate = () => {
    setEditingPromotion(null);
    setShowForm(true);
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      vendorId: promotion.vendorId?._id || promotion.vendorId,
      vendorName: promotion.vendorName || promotion.vendorId?.storeName || "",
      university: promotion.university || "",
      header: promotion.header || "",
      discount: promotion.discount || "",
      text: promotion.text || "",
      duration: promotion.duration || "",
      endDate: promotion.endDate ? String(promotion.endDate).slice(0, 10) : "",
      status: promotion.status || "active",
      featured: !!promotion.featured,
    });
    setShowForm(true);
  };

  // CRUD
  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = [
      formData.vendorId,
      formData.university,
      formData.header,
      formData.discount,
      formData.text,
      formData.duration,
    ];
    if (required.some((x) => !x || String(x).trim() === "")) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setSubmitting(true);
      const url = editingPromotion
        ? `${PROMO_API}/${editingPromotion._id}`
        : PROMO_API;
      const method = editingPromotion ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save promotion");
      toast.success(
        editingPromotion ? "Promotion updated" : "Promotion created"
      );
      await fetchPromotions();
      resetForm();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Error saving promotion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;
    try {
      const res = await fetch(`${PROMO_API}/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      toast.success("Promotion deleted");
      fetchPromotions();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Error deleting");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    let next = "active";
    if (currentStatus === "active") next = "inactive";
    else if (currentStatus === "inactive") next = "active";
    else if (currentStatus === "completed") {
      // Optional: allow re-activating completed promotions
      next = "active";
    }
    try {
      const res = await fetch(`${PROMO_API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update status");
      toast.success(`Status set to ${next}`);
      fetchPromotions();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Status update failed");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await fetch(`${PROMO_API}/${id}/featured`, {
        method: "PATCH",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || "Failed to toggle featured");
      toast.success("Featured updated");
      fetchPromotions();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Error updating featured");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {openNav && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpenNav(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ${
          openNav ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-[270px] md:w-[240px]`}
      >
        <SideBar setOpenNav={setOpenNav} />
      </div>

      <div className="flex-1 md:ml-[240px] w-full overflow-y-auto">
        <div className="md:p-6 px-5 mt-3 pb-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 items-center">
              <button
                className="md:hidden flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-white transition-all shadow-sm"
                onClick={() => setOpenNav(true)}
                aria-label="Open menu"
              >
                {/* Hamburger: 3 bars */}
                <span className="flex flex-col gap-1.5">
                  <span className="block w-5 h-[2px] bg-gray-700 rounded" />
                  <span className="block w-5 h-[2px] bg-gray-700 rounded" />
                  <span className="block w-5 h-[2px] bg-gray-700 rounded" />
                </span>
              </button>
              <div className="min-w-0">
                <h1 className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
                  Promotions & Campaigns
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage promotional campaigns and featured vendors
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="hidden md:flex bg-white/80 backdrop-blur-sm border border-gray-200 w-fit p-3 rounded-xl hover:bg-white transition-all shadow-sm group"
                aria-label="Notifications"
              >
                <SlBell
                  size={16}
                  className="text-gray-600 group-hover:text-purple-500 transition-colors"
                />
              </button>
              <button
                onClick={openCreate}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <IoAdd size={18} />
                <span className="text-sm font-semibold">New Promotion</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by vendor, header or university"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 text-gray-500"
                  onClick={() => setSearchQuery("")}
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          {/* Mobile New Promotion button */}
          <div className="md:hidden -mt-3 mb-4">
            <button
              onClick={openCreate}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <IoAdd size={18} />
              <span className="text-sm font-semibold">New Promotion</span>
            </button>
          </div>

          {/* Summary Cards */}
          {loading ? (
            <CardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <SummaryCard
                color="from-purple-500 to-purple-600"
                icon={<MdCampaign size={18} className="text-white/90" />}
                label="Total Campaigns"
                value={summaryStats.total}
              />
              <SummaryCard
                color="from-amber-500 to-orange-500"
                icon={
                  <MdOutlineContentPasteSearch
                    size={18}
                    className="text-white/90"
                  />
                }
                label="Active"
                value={summaryStats.active}
              />
              <SummaryCard
                color="from-emerald-500 to-green-600"
                icon={
                  <span className="w-3 h-3 rounded-full bg-white/90 inline-block" />
                }
                label="Completed"
                value={summaryStats.completed}
              />
              <SummaryCard
                color="from-blue-500 to-blue-600"
                icon={
                  <span className="w-3 h-3 rounded-full bg-white/90 inline-block" />
                }
                label="Featured"
                value={summaryStats.featured}
              />
            </div>
          )}

          {/* Featured */}
          <div className="mt-7 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              Featured Promotions
            </h2>
            {featuredPromotions.length === 0 ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MdOutlineContentPasteSearch /> No featured promotions
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                {featuredPromotions.map((p) => (
                  <div
                    key={p._id}
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                        {p.vendorName?.[0]?.toUpperCase() || "V"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {p.header}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.vendorName} • {p.university}
                        </p>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-[10px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-2 py-0.5 rounded-full shadow">
                      Featured
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ongoing */}
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              Ongoing Campaigns
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <Th>Vendor Name</Th>
                    <Th>Header</Th>
                    <Th>University</Th>
                    <Th>Discount</Th>
                    <Th>Duration</Th>
                    <Th>Status</Th>
                    <Th>Featured</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={3} cols={8} />
                  ) : ongoingCampaigns.length > 0 ? (
                    ongoingCampaigns.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <Td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                              {p.vendorName?.[0]?.toUpperCase() || "V"}
                            </div>
                            <span className="font-medium text-gray-800">
                              {p.vendorName}
                            </span>
                          </div>
                        </Td>
                        <Td className="font-medium text-gray-900">
                          {p.header}
                        </Td>
                        <Td>{p.university}</Td>
                        <Td>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {p.discount}
                          </span>
                        </Td>
                        <Td>{p.duration}</Td>
                        <Td>
                          <button
                            onClick={() => handleToggleStatus(p._id, p.status)}
                            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition"
                            title={`Current: ${p.status}`}
                          >
                            {p.status === "active" ? (
                              <BsToggleOn
                                className="text-green-600"
                                size={20}
                              />
                            ) : (
                              <BsToggleOff
                                className="text-gray-400"
                                size={20}
                              />
                            )}
                            <span className="text-xs capitalize text-gray-700">
                              {p.status}
                            </span>
                          </button>
                        </Td>
                        <Td>
                          <button
                            onClick={() => handleToggleFeatured(p._id)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                              p.featured
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent"
                                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700"
                            }`}
                          >
                            {p.featured ? "Featured" : "Standard"}
                          </button>
                        </Td>
                        <Td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaRegEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <MdOutlineContentPasteSearch
                            size={36}
                            className="text-gray-300"
                          />
                          <p className="text-gray-500 font-medium">
                            No ongoing campaigns
                          </p>
                          <p className="text-sm text-gray-400">
                            Active campaigns will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Completed */}
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-green-500 rounded-full" />
              Completed Campaigns
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <Th>Vendor Name</Th>
                    <Th>Header</Th>
                    <Th>University</Th>
                    <Th>Discount</Th>
                    <Th>Duration</Th>
                    <Th>Featured</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={3} cols={7} />
                  ) : completedCampaigns.length > 0 ? (
                    completedCampaigns.map((p) => (
                      <tr
                        key={p._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <Td className="font-medium text-gray-900">
                          {p.vendorName}
                        </Td>
                        <Td className="font-medium text-gray-900">
                          {p.header}
                        </Td>
                        <Td>{p.university}</Td>
                        <Td>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {p.discount}
                          </span>
                        </Td>
                        <Td>{p.duration}</Td>
                        <Td>
                          <button
                            onClick={() => handleToggleFeatured(p._id)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                              p.featured
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent"
                                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700"
                            }`}
                          >
                            {p.featured ? "Featured" : "Standard"}
                          </button>
                        </Td>
                        <Td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FaRegEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-green-300" />
                          <p className="text-gray-500 font-medium">
                            No completed campaigns
                          </p>
                          <p className="text-sm text-gray-400">
                            Finished campaigns will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={resetForm}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">
                  {editingPromotion ? "Edit Promotion" : "New Promotion"}
                </h3>
                <p className="text-xs text-white/80">
                  Fill in the promotion details
                </p>
              </div>
              <button
                onClick={resetForm}
                disabled={submitting}
                className="p-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1"
            >
              {/* University */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  University<span className="text-red-500"> *</span>
                </label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      university: e.target.value,
                      vendorId: "",
                      vendorName: "",
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select university</option>
                  {Universities?.map((u) => {
                    // Ensure we always extract a string, never render the object itself
                    const uniName =
                      u?.name ||
                      u?.university ||
                      (typeof u === "string" ? u : "Unknown University");
                    const uniKey = u?._id || uniName;
                    return (
                      <option key={uniKey} value={uniName}>
                        {uniName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Vendor */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Vendor<span className="text-red-500"> *</span>
                </label>
                <select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleVendorChange}
                  disabled={!formData.university}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">
                    {formData.university
                      ? "Select vendor"
                      : "Select university first"}
                  </option>
                  {filteredVendors.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.storeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Header */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Header<span className="text-red-500"> *</span>
                </label>
                <input
                  name="header"
                  value={formData.header}
                  onChange={handleInputChange}
                  placeholder="e.g. Freshers Week Deal"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Discount */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Discount<span className="text-red-500"> *</span>
                </label>
                <input
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g. 20% Off"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Duration */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Duration<span className="text-red-500"> *</span>
                </label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 2 Weeks"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* End date */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              {/* Status */}
              <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Featured */}
              <div className="col-span-1 flex items-center gap-3 pt-6">
                <input
                  id="featured"
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Mark as Featured
                </label>
              </div>

              {/* Description */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description<span className="text-red-500"> *</span>
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe the promotion details, terms, etc."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>
                        {editingPromotion ? "Updating..." : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <span>{editingPromotion ? "Update" : "Create"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Th = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>{children}</td>
);

const SummaryCard = ({ color, icon, label, value }) => (
  <div
    className={`group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
  >
    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs font-medium text-white/90">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Promotion;
