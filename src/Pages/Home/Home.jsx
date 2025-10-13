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
import { SlBell } from "react-icons/sl";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import LineChart from "../../components/LineChart/LineChart";
import BarChart from "../../components/BarChat/BarChart";
const Home = () => {
  const [openNav, setOpenNav] = useState(false);
  return (
    <div className="flex w-[100%] justify-between">
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
        <div className="md:p-4 px-5 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-5 items-center">
              <div
                className="md:hidden flex bg-[#f6f6f6] rounded-[10px] p-2 cursor-pointer"
                onClick={() => setOpenNav(true)}
              >
                <IoMenu size={23} />
              </div>
              <h1 className="font-medium text-xl">Global OverView</h1>
            </div>
            {/* <div className="bg-gray-300 w-fit p-2 rounded-4xl">
              <SlBell size={20} />
            </div> */}
          </div>

          <div className="flex  flex-wrap gap-5 items-center">
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-green-100 items-center rounded-2xl md:w-[23%] w-[100%]  sm:w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Successful order</h1>
                <h1 className="font-[600] text-green-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-green-400 p-3 rounded-4xl">
                <IoCheckmark size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-amber-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Ongoing order</h1>
                <h1 className="font-[600] text-amber-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-amber-400 p-3 rounded-4xl">
                <MdOutlineContentPasteSearch size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-red-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Cancelled order</h1>
                <h1 className="font-[600] text-red-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-red-400 p-3 rounded-4xl">
                <IoClose size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-purple-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Revenue</h1>
                <h1 className="font-[600] text-purple-600 text-[20px]">
                  30,000
                </h1>
              </div>
              <div className="bg-purple-400 p-3 rounded-4xl">
                <FaRegMoneyBillAlt size={20} />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h1 className="fw-[500] text-[15px]">Active Universities</h1>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-2 items-center gap-5">
            <div className="flex justify-between gap-3 mt-3 p-4 h-20 bg-[#f1f1f1] shadow-sm items-center rounded-2xl ">
              <div className="">
                <h1 className="font-[500] text-[15px] text-center text-black w-[100%]">
                  Crawford University
                </h1>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-3 p-4 h-20 bg-[#f1f1f1] shadow-sm items-center rounded-2xl ">
              <div className="w-[100%]">
                <h1 className="font-[500] text-[15px] text-center text-black w-[100%]">
                  Bells University
                </h1>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-3 p-4 h-20 bg-[#f1f1f1] shadow-sm items-center rounded-2xl ">
              <div className="w-[100%]">
                <h1 className="font-[500] text-[15px] text-center text-black w-[100%]">
                  Chrisland University
                </h1>
              </div>
            </div>

            <div className="flex justify-between gap-3 mt-3 p-4 h-20 bg-[#f1f1f1] shadow-sm items-center rounded-2xl ">
              <div className="w-[100%]">
                <h1 className="font-[500] text-[15px] text-center text-black w-[100%]">
                  Covenant University
                </h1>
              </div>
            </div>
          </div>
          <div className="md:flex md:justify-between block mt-10">
            <div className="md:w-[45%] w-[100%] ">
              <div className="font-bold text-2xl">Total Revenue</div>
              <div>
                <LineChart />
              </div>
            </div>
            <div className="md:w-[45%] w-[100%]">
              <div className="font-bold text-2xl">Customer map Weekly</div>
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
