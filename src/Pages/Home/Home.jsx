import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import {
  IoBagCheck,
  IoCheckmark,
  IoCheckmarkDone,
  IoClose,
  IoMenu,
  IoPhoneLandscapeOutline,
} from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa6";
import { SlBell } from "react-icons/sl";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import LineChart from "../../components/LineChart/LineChart";
import BarChart from "../../components/BarChat/BarChart";
import { useAppContext } from "../../components/AppContext";
import "./Home.css";
const Home = () => {
  const { Universities, allOrder, allUsers } = useAppContext();
  const [showAddBalance, setShowAddBalance] = useState(false);
  // Lazy load AddBalance page
  const AddBalance = React.lazy(() => import("./AddBalance"));
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [feePeriod, setFeePeriod] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("");
  // const { Universities, allOrder } = useAppContext();
  // Only sum accepted orders
  // Fee summary matches 'success' logic: only currentStatus === 'Delivered'
  // Only sum orders where all packs are accepted
  const acceptedOrders = allOrder
    ? allOrder.filter(
        (order) =>
          Array.isArray(order.packs) &&
          order.packs.length > 0 &&
          order.packs.every((pack) => pack.accepted === true)
      )
    : [];
  const now = new Date();
  const filteredOrders = acceptedOrders.filter((order) => {
    // University filter
    if (selectedUniversity !== "All") {
      // Find vendor for this order
      const vendor =
        order.vendorName || (order.packs && order.packs[0]?.vendorName);
      // Find university for this vendor
      const vendorObj =
        vendor && Universities.find((u) => u.name === order.university);
      if (!vendorObj || vendorObj.name !== selectedUniversity) return false;
    }
    const orderDate = new Date(order.createdAt);
    if (selectedDate) {
      // If a date is selected, filter by that date
      const selected = new Date(selectedDate);
      return (
        orderDate.getDate() === selected.getDate() &&
        orderDate.getMonth() === selected.getMonth() &&
        orderDate.getFullYear() === selected.getFullYear()
      );
    }
    if (feePeriod === "daily") {
      return orderDate.toDateString() === now.toDateString();
    } else if (feePeriod === "monthly") {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    } else if (feePeriod === "yearly") {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });
  const totalServiceFee = filteredOrders.reduce(
    (sum, o) => sum + (o.serviceFee || 0),
    0
  );
  const totalDeliveryFee = filteredOrders.reduce(
    (sum, o) => sum + (o.deliveryFee || 0),
    0
  );
  const totalRiderFee = filteredOrders.reduce(
    (sum, o) => sum + (o.deliveryFee || 0) * 0.5,
    0
  );
  // Vendor fee is the subtotal
  const totalVendorFee = filteredOrders.reduce(
    (sum, o) => sum + (o.subtotal || 0),
    0
  );
  const totalFee =
    totalServiceFee + totalDeliveryFee + totalRiderFee + totalVendorFee;

  // Calculate total user balance
  const totalUserBalance =
    allUsers && Array.isArray(allUsers)
      ? allUsers.reduce((sum, user) => sum + (user.availableBal || 0), 0)
      : 0;
  const [openNav, setOpenNav] = useState(false);

  console.log(allOrder);

  // Apply university filter to status groups
  const success = allOrder.filter((item) => {
    if (item.currentStatus !== "Delivered") return false;
    if (selectedUniversity !== "All") {
      const vendor =
        item.vendorName || (item.packs && item.packs[0]?.vendorName);
      const vendorObj =
        vendor && Universities.find((u) => u.name === item.university);
      if (!vendorObj || vendorObj.name !== selectedUniversity) return false;
    }
    return true;
  });
  const pending = allOrder.filter((item) => {
    if (item.currentStatus !== "Pending") return false;
    if (selectedUniversity !== "All") {
      const vendor =
        item.vendorName || (item.packs && item.packs[0]?.vendorName);
      const vendorObj =
        vendor && Universities.find((u) => u.name === item.university);
      if (!vendorObj || vendorObj.name !== selectedUniversity) return false;
    }
    return true;
  });
  const cancelled = allOrder.filter((item) => {
    if (item.currentStatus !== "Cancelled") return false;
    if (selectedUniversity !== "All") {
      const vendor =
        item.vendorName || (item.packs && item.packs[0]?.vendorName);
      const vendorObj =
        vendor && Universities.find((u) => u.name === item.university);
      if (!vendorObj || vendorObj.name !== selectedUniversity) return false;
    }
    return true;
  });

  return (
    <div className="flex w-[100%] justify-between min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
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

      <div className="flex-1 md:ml-[240px] w-full min-h-screen overflow-y-auto">
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
                  Global Overview
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Monitor platform metrics and university activity
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white/90">
                    Successful Orders
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                    <IoCheckmark size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{success.length}</p>
                <p className="text-xs text-white/80 mt-1">Delivered</p>
              </div>
            </div>
            <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white/90">
                    Ongoing Orders
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                    <MdOutlineContentPasteSearch
                      size={20}
                      className="text-white"
                    />
                  </div>
                </div>
                <p className="text-3xl font-bold">{pending.length}</p>
                <p className="text-xs text-white/80 mt-1">In Progress</p>
              </div>
            </div>
            <div className="group relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white/90">
                    Cancelled Orders
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                    <IoClose size={20} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{cancelled.length}</p>
                <p className="text-xs text-white/80 mt-1">Declined</p>
              </div>
            </div>
          </div>
          {/* Fee Summary Toggle & Cards (new, isolated section) */}

          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="font-semibold text-gray-700">Fee Summary:</span>
            <select
              className="px-2 py-1 rounded-md border text-xs bg-white text-blue-700 border-blue-200 mr-2"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
            >
              <option value="All">All Universities</option>
              {Universities.map((u) => (
                <option key={u._id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
            <button
              className={`px-2 py-1 rounded-md border text-xs ${
                feePeriod === "daily"
                  ? "bg-blue-100 text-blue-700 border-blue-300"
                  : "bg-white text-blue-500 border-blue-100"
              }`}
              onClick={() => setFeePeriod("daily")}
            >
              Daily
            </button>
            <button
              className={`px-2 py-1 rounded-md border text-xs ${
                feePeriod === "monthly"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-white text-green-500 border-green-100"
              }`}
              onClick={() => setFeePeriod("monthly")}
            >
              Monthly
            </button>
            <button
              className={`px-2 py-1 rounded-md border text-xs ${
                feePeriod === "yearly"
                  ? "bg-purple-100 text-purple-700 border-purple-300"
                  : "bg-white text-purple-500 border-purple-100"
              }`}
              onClick={() => setFeePeriod("yearly")}
            >
              Yearly
            </button>
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <input
                type="date"
                className="px-2 py-1 rounded-md border text-xs bg-white text-blue-700 border-blue-200"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={now.toISOString().split("T")[0]}
              />
              <button
                type="button"
                className="px-2 py-1 rounded-md border text-xs bg-gray-100 text-gray-700 border-gray-300"
                onClick={() => setSelectedDate("")}
                disabled={!selectedDate}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
            <div className="p-2 rounded-lg border border-blue-200 bg-blue-50 flex flex-col items-center justify-center">
              <FaRegMoneyBillAlt size={16} className="text-blue-400 mb-1" />
              <span className="text-xs font-medium text-blue-700">
                Total Service Fee
              </span>
              <span className="text-sm font-bold text-blue-900">
                ₦{totalServiceFee.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg border border-green-200 bg-green-50 flex flex-col items-center justify-center">
              <IoBagCheck size={16} className="text-green-400 mb-1" />
              <span className="text-xs font-medium text-green-700">
                Total Company Fee
              </span>
              <span className="text-sm font-bold text-green-900">
                ₦{totalRiderFee.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg border border-amber-200 bg-amber-50 flex flex-col items-center justify-center">
              <IoCheckmarkDone size={16} className="text-amber-400 mb-1" />
              <span className="text-xs font-medium text-amber-700">
                Total Rider Fee
              </span>
              <span className="text-sm font-bold text-amber-900">
                ₦{totalRiderFee.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg border border-rose-200 bg-rose-50 flex flex-col items-center justify-center">
              <SlBell size={16} className="text-rose-400 mb-1" />
              <span className="text-xs font-medium text-rose-700">
                Total Vendor Fee
              </span>
              <span className="text-sm font-bold text-rose-900">
                ₦{totalVendorFee.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg border border-gray-300 bg-gray-50 flex flex-col items-center justify-center">
              <FaRegMoneyBillAlt size={16} className="text-gray-400 mb-1" />
              <span className="text-xs font-medium text-gray-700">
                Total Fee
              </span>
              <span className="text-sm font-bold text-gray-900">
                ₦{totalFee.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded-lg border border-indigo-200 bg-indigo-50 flex flex-col items-center justify-center">
              <FaRegMoneyBillAlt size={16} className="text-indigo-400 mb-1" />
              <span className="text-xs font-medium text-indigo-700">
                Total User Balance
              </span>
              <span className="text-sm font-bold text-indigo-900">
                ₦{totalUserBalance.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-7 mb-4">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-500 rounded-full" />
              Active Universities
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {Universities.length} registered institutions
            </p>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mb-8">
            {Universities.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-4 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md items-center rounded-xl transition-all hover:-translate-y-0.5 group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-3 rounded-lg text-white shadow-sm">
                  <FaRegBuilding size={18} />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <h2 className="font-bold text-lg text-gray-900 mb-4">
                Total Revenue
              </h2>
              <div>
                <LineChart />
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <h2 className="font-bold text-lg text-gray-900 mb-4">
                Customer Map Weekly
              </h2>
              <div>
                <BarChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
