import React, { useState } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { IoCheckmark, IoClose, IoMenu } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { FaRegMoneyBillAlt, FaRegUser } from "react-icons/fa";
import { GoPackage } from "react-icons/go";
import { GiMoneyStack } from "react-icons/gi";
import {
  MdOutlineContentPasteSearch,
  MdOutlinePedalBike,
} from "react-icons/md";
import { AiTwotoneShop } from "react-icons/ai";
import LineChart from "../../components/LineChart/LineChart";
import BarChart from "../../components/BarChat/BarChart";
const Universities = () => {
  const [openNav, setOpenNav] = useState(false);
  return (
    <div className="flex w-full">
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
        <div className="md:p-4 px-5 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-5 items-center">
              <div
                className="md:hidden flex bg-[#f6f6f6] rounded-[10px] p-2 cursor-pointer"
                onClick={() => setOpenNav(true)}
              >
                <IoMenu size={23} />
              </div>
              <h1 className="font-medium text-xl">University Overview</h1>
            </div>
            <div className="bg-gray-300 w-fit p-2 rounded-4xl">
              <SlBell size={20} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-light">select University</p>
            <select
              name=""
              id=""
              className="border-1 py-2 w-60 text-sm mt-1 outline-0 border-[#d3d3d3]"
            >
              <option value="">Crawford University</option>
              <option value="">Bowen University</option>
              <option value="">Bells University</option>
            </select>
          </div>
          <div className="flex  flex-wrap gap-5 items-center">
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-purple-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Customer</h1>
                <h1 className="font-[600] text-purple-600 text-[20px]">300</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-purple-400 p-3 rounded-4xl">
                <FaRegUser size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-green-100 items-center rounded-2xl md:w-[23%] w-[100%]  sm:w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Vendor</h1>
                <h1 className="font-[600] text-green-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-green-400 p-3 rounded-4xl">
                <AiTwotoneShop size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-amber-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Rider</h1>
                <h1 className="font-[600] text-amber-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-amber-400 p-3 rounded-4xl">
                <MdOutlinePedalBike size={20} />
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-3 p-4  h-30 bg-red-100 items-center rounded-2xl md:w-[23%] w-[100%] w-[48%]">
              <div>
                <h1 className="font-[400] text-[14px]">Total Revenue</h1>
                <h1 className="font-[600] text-red-600 text-[20px]">100</h1>
                <div className="font-[13px] font-[400]">Orders</div>
              </div>
              <div className="bg-red-400 p-3 rounded-4xl">
                <GiMoneyStack size={20} />
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="font-bold">Registered customers</h1>
            <div className="flex item-center gap-4 flex-wrap mt-4">
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="font-bold">Registered Vendor</h1>
            <div className="flex item-center gap-4 flex-wrap mt-4">
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h1 className="font-bold">Registered Rider</h1>
            <div className="flex item-center gap-4 flex-wrap mt-4">
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
              </div>
              <div className="w-30 bg-[#D9D9D94D] p-2 rounded text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                  alt=""
                />
                <p className="text-sm font-medium mt-1">john doe</p>
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

export default Universities;
