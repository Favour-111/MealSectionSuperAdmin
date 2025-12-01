import React, { useState, useMemo } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { FiUser } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { AiTwotoneShop } from "react-icons/ai";
import { MdOutlinePedalBike } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import LineChart from "../../components/LineChart/LineChart";
import BarChart from "../../components/BarChat/BarChart";
import { useAppContext } from "../../components/AppContext";
import { CardsSkeleton, ListSkeleton } from "../../components/ui/Skeleton";
import { CiShoppingCart } from "react-icons/ci";
import { MdDirectionsBike } from "react-icons/md";
import "../Home/Home.css";

const Universities = () => {
  const [openNav, setOpenNav] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const { Universities, allOrder, allUsers, vendors, riders, isLoading } =
    useAppContext();

  // 🔹 Filter data by selected university
  const filteredOrders = useMemo(() => {
    if (!selectedUniversity) return allOrder;
    return allOrder.filter((order) => order.university === selectedUniversity);
  }, [allOrder, selectedUniversity]);

  const filteredUsers = useMemo(() => {
    if (!selectedUniversity) return allUsers;
    return allUsers.filter((user) => user.university === selectedUniversity);
  }, [allUsers, selectedUniversity]);

  const filteredVendors = useMemo(() => {
    if (!selectedUniversity) return vendors;
    return vendors.filter((vendor) => vendor.university === selectedUniversity);
  }, [vendors, selectedUniversity]);

  const filteredRiders = useMemo(() => {
    if (!selectedUniversity) return riders;
    return riders.filter((rider) => rider.university === selectedUniversity);
  }, [riders, selectedUniversity]);

  // 🔹 Calculate total revenue for filtered orders
  const totalRevenue = filteredOrders.reduce(
    (sum, order) =>
      sum +
      (order.subtotal || 0) +
      (order.serviceFee || 0) +
      (order.deliveryFee || 0),
    0
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {openNav && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenNav(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300
          ${openNav ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 w-[270px] md:w-[240px]`}
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
              >
                <IoMenu size={18} className="text-gray-700" />
              </button>
              <div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  University Overview
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Monitor and analyze university-specific metrics
                </p>
              </div>
            </div>
          </div>
          {/* University Selector */}
          <div className="mb-5">
            <label className="text-xs font-medium text-gray-600 block mb-2">
              Filter by University
            </label>
            <select
              className="border-2 border-gray-200 py-2.5 px-3 w-full md:w-80 text-sm rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
            >
              <option value="">All Universities</option>
              {Universities.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          {/* Stats Cards */}
          {isLoading ? (
            <CardsSkeleton />
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white/90">
                      Total Customers
                    </p>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <FaRegUser size={18} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{filteredUsers.length}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white/90">
                      Total Vendors
                    </p>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <AiTwotoneShop size={18} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{filteredVendors.length}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white/90">
                      Total Riders
                    </p>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <MdOutlinePedalBike size={18} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{filteredRiders.length}</p>
                </div>
              </div>

              <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white/90">
                      Total Revenue
                    </p>
                    <div className="bg-white/20 p-2 rounded-lg">
                      <GiMoneyStack size={18} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">
                    ₦{totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-7 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-purple-500 rounded-full" />
              Registered Customers ({filteredUsers.length})
            </h2>
            {selectedUniversity && (
              <p className="text-xs text-gray-500 mb-4">
                Filtered by:{" "}
                <span className="font-medium">{selectedUniversity}</span>
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {isLoading ? (
                <ListSkeleton />
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center rounded-full shadow-lg shadow-purple-500/20">
                      <FiUser size={18} className="text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      {item.fullName}
                    </p>
                    <p className="text-xs font-semibold text-indigo-700">
                      Balance: ₦{(item.availableBal || 0).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="w-full py-8 text-center">
                  <FiUser size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">
                    No customers registered
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-7 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-green-500 rounded-full" />
              Registered Vendors ({filteredVendors.length})
            </h2>
            {selectedUniversity && (
              <p className="text-xs text-gray-500 mb-4">
                Filtered by:{" "}
                <span className="font-medium">{selectedUniversity}</span>
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {isLoading ? (
                <ListSkeleton />
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center rounded-full shadow-lg shadow-green-500/20">
                      <CiShoppingCart size={18} className="text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      {item.storeName}
                    </p>
                  </div>
                ))
              ) : (
                <div className="w-full py-8 text-center">
                  <CiShoppingCart
                    size={32}
                    className="text-gray-300 mx-auto mb-2"
                  />
                  <p className="text-gray-500 font-medium">
                    No vendors registered
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-7 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              Registered Riders ({filteredRiders.length})
            </h2>
            {selectedUniversity && (
              <p className="text-xs text-gray-500 mb-4">
                Filtered by:{" "}
                <span className="font-medium">{selectedUniversity}</span>
              </p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {isLoading ? (
                <ListSkeleton />
              ) : filteredRiders.length > 0 ? (
                filteredRiders.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center rounded-full shadow-lg shadow-orange-500/20">
                      <MdDirectionsBike size={18} className="text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-700">
                      {item.userName}
                    </p>
                  </div>
                ))
              ) : (
                <div className="w-full py-8 text-center">
                  <MdDirectionsBike
                    size={32}
                    className="text-gray-300 mx-auto mb-2"
                  />
                  <p className="text-gray-500 font-medium">
                    No riders registered
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Charts */}
          {/* <div className="md:flex md:justify-between block mt-10">
            <div className="md:w-[45%] w-[100%]">
              <div className="font-bold text-2xl mb-2">Total Revenue</div>
              <LineChart filteredOrders={filteredOrders} />
            </div>
            <div className="md:w-[45%] w-[100%]">
              <div className="font-bold text-2xl mb-2">Customer Map Weekly</div>
              <BarChart filteredOrders={filteredOrders} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Universities;
