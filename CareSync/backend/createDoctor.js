import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";
import 'dotenv/config';

const doctors = [
  {
    name: "Dr. Raj Patel",
    email: "rajpatel@gmail.com",
    password: "123456",
    speciality: "General Physician",
    degree: "MBBS",
    experience: "8 Years",
    about: "Experienced general physician",
    fees: 500,
    address: { line1: "Adajan", line2: "Surat, Gujarat" },
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Neha Shah",
    email: "nehashah@gmail.com",
    password: "123456",
    speciality: "Gynecologist",
    degree: "MBBS, MD",
    experience: "7 Years",
    about: "Women health specialist",
    fees: 600,
    address: { line1: "Vesu", line2: "Surat, Gujarat" },
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Amit Mehta",
    email: "amitmehta@gmail.com",
    password: "123456",
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: "6 Years",
    about: "Skin care expert",
    fees: 400,
    address: { line1: "Navrangpura", line2: "Ahmedabad, Gujarat" },
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Pooja Desai",
    email: "poojadesai@gmail.com",
    password: "123456",
    speciality: "Pediatricians",
    degree: "MBBS, MD",
    experience: "5 Years",
    about: "Child specialist",
    fees: 450,
    address: { line1: "Alkapuri", line2: "Vadodara, Gujarat" },
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Karan Singh",
    email: "karansingh@gmail.com",
    password: "123456",
    speciality: "Neurologist",
    degree: "MBBS, DM",
    experience: "10 Years",
    about: "Brain specialist",
    fees: 800,
    address: { line1: "Andheri", line2: "Mumbai, Maharashtra" },
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Riya Sharma",
    email: "riyasharma@gmail.com",
    password: "123456",
    speciality: "Gastroenterologist",
    degree: "MBBS, DM",
    experience: "9 Years",
    about: "Digestive system specialist",
    fees: 700,
    address: { line1: "Connaught Place", line2: "Delhi, India" },
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop"
  }
];

const createDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");

    for (let doc of doctors) {
      const existingDoctor = await doctorModel.findOne({ email: doc.email });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(doc.password, salt);

      if (existingDoctor) {
        await doctorModel.updateOne(
          { email: doc.email },
          {
            ...doc,
            password: hashedPassword,
            available: true,
            date: Date.now()
          }
        );
        console.log(`Updated: ${doc.email}`);
      } else {
        await doctorModel.create({
          ...doc,
          password: hashedPassword,
          available: true,
          date: Date.now()
        });
        console.log(`Created: ${doc.email}`);
      }
    }

    console.log("All doctors processed");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
};

createDoctors();








