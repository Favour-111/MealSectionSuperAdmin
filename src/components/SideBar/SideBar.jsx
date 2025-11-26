import React, { useState } from "react";
import { GrAppsRounded } from "react-icons/gr";
import { LuNewspaper } from "react-icons/lu";
import { GrHistory } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BsBank } from "react-icons/bs";
import { IoGiftOutline, IoWalletOutline } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
const SideBar = ({ setOpenNav }) => {
  const pathToItem = {
    "/home": "home",
    "/order": "order",
    "/fee": "fee",
    "/universities": "universities",
    "/vendors": "vendors",
    "/withdraw": "withdraw",
    "/promotion": "promotion",
  };
  const selectedItem = pathToItem[location.pathname] || "home";
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full overflow-y-auto bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-xl">
      <div className="flex items-center justify-between p-3">
        <img
          src="https://github.com/Favour-111/my-asset/blob/main/images%20(2).jpeg?raw=true"
          alt="logo"
          className="w-[150px]"
        />

        {/* Close only visible on mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpenNav?.(false)}
          aria-label="Close sidebar"
        >
          <AiOutlineClose size={20} />
        </button>
      </div>

      <div className="mt-3">
        <div
          onClick={() => {
            navigate("/home");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "home"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <GrAppsRounded />
          <div className="text-[13px]">OverView</div>
        </div>

        <div
          onClick={() => {
            navigate("/order");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "order"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <LuNewspaper />
          <div className="text-[13px]">Order</div>
        </div>

        <div
          onClick={() => {
            navigate("/universities");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "universities"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <BsBank />
          <div className="text-[13px]">Universities</div>
        </div>
        <div
          onClick={() => {
            navigate("/vendors");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "vendors"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <MdStorefront />
          <div className="text-[13px]">Vendors</div>
        </div>
        <div
          onClick={() => {
            navigate("/withdraw");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "withdraw"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <IoWalletOutline />
          <div className="text-[13px]">Withdraw</div>
        </div>
        <div
          onClick={() => {
            navigate("/promotion");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "promotion"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <IoGiftOutline />
          <div className="text-[13px]">Promotion</div>
        </div>
        <div
          onClick={() => {
            navigate("/fee");
          }}
          className={`flex items-center gap-3 h-11 cursor-pointer w-full px-4 rounded-lg mx-2 my-1 transition-all ${
            selectedItem === "fee"
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-700 hover:bg-gray-50"
          } `}
        >
          <FiSettings />
          <div className="text-[13px]">Fee settings</div>
        </div>
        <div
          onClick={() => {
            localStorage.clear();
            window.location.replace("/");
          }}
          className="absolute bottom-0 left-0 right-0 flex justify-center text-red-600 bg-red-50 hover:bg-red-100 items-center gap-2 h-11 cursor-pointer w-full px-4"
        >
          <CiLogout />
          <div className="text-[13px]">Sign Out</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
