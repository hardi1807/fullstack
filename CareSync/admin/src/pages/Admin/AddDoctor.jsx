import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { aToken, getAllDoctors } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      console.log("========== FORM SUBMIT START ==========");

      console.log("👉 TOKEN:", aToken);

      console.log("👉 FORM VALUES:");
      console.log({
        name,
        email,
        password,
        experience,
        fees,
        about,
        speciality,
        degree,
        address1,
        address2,
      });

      if (!docImg) {
        console.log("❌ IMAGE MISSING");
        return toast.error("Image Not Selected");
      }

      console.log("👉 IMAGE FILE:", docImg);

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      console.log("========== FORMDATA ==========");
      formData.forEach((value, key) => {
        console.log(`👉 ${key}:`, value);
      });

      console.log("========== API CALL START ==========");

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: {
            token: aToken,
          },
        }
      );

      console.log("========== API RESPONSE ==========");
      console.log(data);

      if (data.success) {
        console.log("✅ SUCCESS ADD DOCTOR");
        toast.success(data.message);

        getAllDoctors();

        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        console.log("❌ BACKEND ERROR:", data.message);
        toast.error(data.message);
      }

      console.log("========== FORM SUBMIT END ==========");

    } catch (error) {
      console.log("❌ FRONTEND ERROR:");
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        
        {/* IMAGE */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => {
              console.log("👉 IMAGE SELECTED:", e.target.files[0]);
              setDocImg(e.target.files[0]);
            }}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 text-gray-600">
          
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-4">
            <input onChange={(e) => setName(e.target.value)} value={name} className="border px-3 py-2" placeholder="Name" required />
            <input onChange={(e) => setEmail(e.target.value)} value={email} className="border px-3 py-2" placeholder="Email" required />
            <input onChange={(e) => setPassword(e.target.value)} value={password} className="border px-3 py-2" type="password" placeholder="Password" required />

            <select onChange={(e) => setExperience(e.target.value)} value={experience} className="border px-2 py-2">
              <option value="1 Year">1 Year</option>
              <option value="2 Year">2 Years</option>
              <option value="3 Year">3 Years</option>
              <option value="4 Year">4 Years</option>
              <option value="5 Year">5 Years</option>
            </select>

            <input onChange={(e) => setFees(e.target.value)} value={fees} className="border px-3 py-2" type="number" placeholder="Doctor fees" required />
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex flex-col gap-4">
            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className="border px-2 py-2">
              <option value="General physician">General physician</option>
              <option value="Dermatologist">Dermatologist</option>
            </select>

            <input onChange={(e) => setDegree(e.target.value)} value={degree} className="border px-3 py-2" placeholder="Degree" required />

            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className="border px-3 py-2" placeholder="Address 1" required />
            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className="border px-3 py-2" placeholder="Address 2" required />
          </div>
        </div>

        {/* ABOUT */}
        <textarea
          onChange={(e) => setAbout(e.target.value)}
          value={about}
          className="w-full border mt-4 p-2"
          rows={4}
          placeholder="Write about doctor"
        />

        <button className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;