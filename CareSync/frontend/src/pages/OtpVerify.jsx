import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/user/verify-login",
        { email, otp }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        toast.success("Login success");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-[300px]">
        <h2 className="text-xl mb-4 text-center">Enter OTP</h2>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="border w-full p-2 text-center"
        />

        <button
          onClick={handleVerify}
          className="bg-blue-500 text-white w-full mt-4 p-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;