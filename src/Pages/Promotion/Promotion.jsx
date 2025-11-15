import React, { useState, useMemo, useEffect } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { FaRegEdit, FaRegMoneyBillAlt } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { MdOutlineContentPasteSearch, MdCampaign } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import "../Home/Home.css";
import { CardsSkeleton, TableSkeleton } from "../../components/ui/Skeleton";
const Promotion = () => {
  const [openNav, setOpenNav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Sample data - replace with actual API data
  const ongoingCampaigns = [
    {
      id: "C101",
      vendor: "Elegance",
      discount: "10%",
      duration: "1 Week",
      status: "Active",
    },
  ];

  const completedCampaigns = [
    {
      id: "C101",
      vendor: "Elegance",
      discount: "10%",
      duration: "1 Week",
      status: "Completed",
    },
  ];

  // Calculate summary stats
  const summaryStats = useMemo(
    () => ({
      total: ongoingCampaigns.length + completedCampaigns.length,
      active: ongoingCampaigns.length,
      completed: completedCampaigns.length,
      featured: 1,
    }),
    [ongoingCampaigns.length, completedCampaigns.length]
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {openNav && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenNav(false)}
        />
      )}

      {/* Sidebar: slides in on mobile, always visible on md+ */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300
          ${openNav ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 w-[270px] md:w-[240px]
        `}
      >
        <SideBar setOpenNav={setOpenNav} />
      </div>

      <div className="flex-1 md:ml-[240px] w-full overflow-y-auto">
        <div className="md:p-6 px-5 mt-3 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4 items-center">
              <button
                className="md:hidden flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-white transition-all shadow-sm"
                onClick={() => setOpenNav(true)}
              >
                <IoMenu size={18} className="text-gray-700" />
              </button>
              <div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Promotions & Campaigns
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage promotional campaigns and featured vendors
                </p>
              </div>
            </div>
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 w-fit p-3 rounded-xl hover:bg-white transition-all shadow-sm group">
              <SlBell
                size={16}
                className="text-gray-600 group-hover:text-purple-500 transition-colors"
              />
            </button>
          </div>

          {/* Summary Cards */}
          {loading ? (
            <CardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdCampaign className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Total Campaigns
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{summaryStats.total}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <MdOutlineContentPasteSearch
                      className="text-white/90"
                      size={18}
                    />
                    <p className="text-xs font-medium text-white/90">Active</p>
                  </div>
                  <p className="text-2xl font-bold">{summaryStats.active}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <IoCheckmark className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Completed
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{summaryStats.completed}</p>
                </div>
              </div>
              <div className="group relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <GoPackage className="text-white/90" size={18} />
                    <p className="text-xs font-medium text-white/90">
                      Featured
                    </p>
                  </div>
                  <p className="text-2xl font-bold">{summaryStats.featured}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-amber-500 rounded-full" />
              Ongoing Campaigns
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={3} cols={6} />
                  ) : ongoingCampaigns.length > 0 ? (
                    ongoingCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {campaign.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {campaign.vendor}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {campaign.discount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {campaign.duration}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <FaRegEdit size={16} />
                            </button>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
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
          <div className="mt-7 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              Featured Vendors
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Elegance"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-1 right-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                    Featured
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800 mt-3 text-center">
                  Elegance
                </p>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-green-500 rounded-full" />
              Completed Campaigns
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={3} cols={5} />
                  ) : completedCampaigns.length > 0 ? (
                    completedCampaigns.map((campaign) => (
                      <tr
                        key={campaign.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {campaign.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {campaign.vendor}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {campaign.discount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {campaign.duration}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {campaign.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <IoCheckmark size={36} className="text-gray-300" />
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
    </div>
  );
};

export default Promotion;
