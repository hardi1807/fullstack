import axios from "axios";
import React, { useContext, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    console.log("Login clicked");

    try {
      // ================= ADMIN LOGIN =================
      if (state === "Admin") {
        // clear old tokens
        localStorage.removeItem("aToken");
        localStorage.removeItem("dToken");

        const { data } = await axios.post(
          backendUrl + "/api/admin/login",
          {
            email,
            password,
          }
        );

        console.log("ADMIN RESPONSE:", data);

        if (data.success) {
          // ✅ save admin token
          localStorage.setItem("aToken", data.token);

          // ✅ update context
          setAToken(data.token);

          toast.success("Admin Login Successful");

          // ✅ redirect
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      }

      // ================= DOCTOR LOGIN =================
      else {
        // clear old tokens
        localStorage.removeItem("aToken");
        localStorage.removeItem("dToken");

        const { data } = await axios.post(
          backendUrl + "/api/doctor/login",
          {
            email,
            password,
          }
        );

        console.log("DOCTOR RESPONSE:", data);

        if (data.success) {
          // ✅ save doctor token (FIXED)
          localStorage.setItem("dToken", data.token);

          // ✅ update doctor context (FIXED)
          setDToken(data.token);

          toast.success("Doctor Login Successful");

          // ✅ redirect to doctor dashboard
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("ERROR:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        {/* EMAIL */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>

        {/* SWITCH LOGIN */}
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => setState("Doctor")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;



/*import axios from "axios";
import React, { useContext, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    console.log("Login clicked");

    try {
      if (state === "Admin") {
        // 🔥 FIX 1: Clear old token
        localStorage.removeItem("aToken");

        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        console.log("ADMIN RESPONSE:", data);

        if (data.success) {
          // ✅ Save token first
          localStorage.setItem("aToken", data.token);

          // ✅ Then update context
          setAToken(data.token);

          console.log("TOKEN SAVED:", data.token);

          toast.success("Admin Login Successful");

          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });

        console.log("DOCTOR RESPONSE:", data);

        if (data.success) {
          localStorage.setItem("token", data.token);
          setAToken(data.token);  

          toast.success("Doctor Login Successful");

          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("ERROR:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => setState("Doctor")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;   */
