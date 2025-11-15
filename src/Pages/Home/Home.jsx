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
  const [openNav, setOpenNav] = useState(false);
  const { Universities, allOrder } = useAppContext();
  console.log(allOrder);

  const success = allOrder.filter((item) => item.currentStatus === "Delivered");
  const pending = allOrder.filter((item) => item.currentStatus === "Pending");
  const cancelled = allOrder.filter(
    (item) => item.currentStatus === "Cancelled"
  );

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
            <button className="bg-white/80 backdrop-blur-sm border border-gray-200 w-fit p-3 rounded-xl hover:bg-white transition-all shadow-sm group">
              <SlBell
                size={16}
                className="text-gray-600 group-hover:text-purple-500 transition-colors"
              />
            </button>
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
