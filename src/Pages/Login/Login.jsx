import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogin({ ...login, [name]: value });
  };
  const submitForm = () => {
    if (login.email === "admin@gmail.com" || login.password === 123) {
      navigate("/home");
    }
  };
  return (
    <div className="md:flex block">
      <div className="md:w-[50%] w-[100%] md:h-[100vh] sm:h-[600px] h-[450px] bg-[var(--default)] grid place-items-center">
        <img
          src="https://png.pngtree.com/png-vector/20221219/ourmid/pngtree-delivery-boy-with-food-png-image_6528630.png"
          alt=""
          className="md:w-[300px] w-[200px] md:h-[300px] h-[200px]"
        />
      </div>
      <div className="flex-1 md:mt-[90px] flex flex-col items-center justify-between md:h-[80vh] h-[350px] w-[100%] md:w-[50%] rounded-4xl mt-[-40px] bg-white">
        <div className="flex-1 md:flex items-center justify-center hidden">
          <img
            src="https://favour-111.github.io/MEalSection-ComongSoon-2.0/WhatsApp%20Image%202024-08-24%20at%2020.18.12_988ce6f9.jpg"
            alt=""
            className="w-[200px]"
          />
        </div>

        <div className="flex-10 w-[100%] md:px-20 px-10 flex items-center gap-2 flex-col  mt-[50px]">
          <div className="w-[100%]">
            <label htmlFor="" className="font-medium text-[13px]">
              Email or Phone
            </label>
            <br />
            <input
              name="email"
              onChange={handleInput}
              type="text"
              placeholder="Enter your email or phone number"
              className="border border-[#d3d3d3] px-3 py-2 md:py-1 rounded-[10px] w-[100%] mt-1.5 placeholder-gray-400 placeholder:text-[12px] outline-none"
            />
          </div>
          <div className="w-[100%]">
            <label htmlFor="" className="font-medium text-[13px]">
              Password
            </label>
            <br />
            <input
              name="password"
              type="text"
              onChange={handleInput}
              placeholder="Enter your password"
              className="border border-[#d3d3d3] px-3 py-2 md:py-1 rounded-[10px] w-[100%] mt-1.5 placeholder-gray-400 placeholder:text-[12px] outline-none"
            />
          </div>
          <div className=" w-[100%] flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <input type="checkbox" />
              <div className="font-light text-sm">Remember Me</div>
            </div>
            <Link className="text-sm text-[var(--default)]">
              Forgot Password?
            </Link>
          </div>
          <button
            onClick={() => submitForm()}
            className="mt-2 bg-[var(--default)] text-white text-sm p-2.5 rounded-[10px] md:w-[70%] w-[100%]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
