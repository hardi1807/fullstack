import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier"
import userModel from "../models/userModel.js";

// ================== ADMIN LOGIN ==================
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("ENV:", process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    console.log("INPUT:", email, password);

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================== GET ALL APPOINTMENTS ==================
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================== CANCEL APPOINTMENT ==================
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// helper function for stream upload
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "doctors" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const addDoctor = async (req, res) => {
  try {
    console.log("Configured Cloud:", cloudinary.config().cloud_name);

    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // ================== VALIDATION ==================
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!imageFile) {
      return res.json({ success: false, message: "Image is required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // ================== HASH PASSWORD ==================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ================== CLOUDINARY UPLOAD (FIXED) ==================
    const result = await streamUpload(imageFile.buffer);

    const imageUrl = result.secure_url;

    console.log("Uploaded Image URL:", imageUrl);

    // ================== CREATE DOCTOR ==================
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    await doctorModel.create(doctorData);

    return res.json({
      success: true,
      message: "Doctor Added Successfully",
    });
  } catch (error) {
    console.log("ERROR 👉", error);
    res.json({ success: false, message: error.message });
  }
};


// ================== GET ALL DOCTORS ==================
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================== ADMIN DASHBOARD ==================
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: [...appointments].reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ================== EXPORT ==================
export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
};
