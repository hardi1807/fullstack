import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();

  const { doctors, getDoctorsData } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(
        doctors.filter(
          (doc) =>
            doc.speciality &&
            doc.speciality.toLowerCase() === speciality.toLowerCase()
        )
      );
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  useEffect(() => {
    getDoctorsData();
  }, []);

  return (
    <div>

      <p className="text-gray-600">Browse doctors</p>

      <div className="grid grid-cols-auto gap-4 mt-5">

        {filterDoc.map((item, index) => (

          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg"
          >

            {/* ✅ IMAGE FIXED */}
            <img
              className="w-full h-48 object-cover"
              src={item?.image}
              onError={(e) => {
                console.log("IMAGE FAILED:", item?.image);
                e.target.src = "/default.png";
              }}
              alt="doctor"
            />

            <div className="p-3">
              <p className="text-lg font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>

              <p className={item.available ? "text-green-500" : "text-gray-400"}>
                {item.available ? "Available" : "Not Available"}
              </p>
            </div>

          </div>

        ))}

      </div>
    </div>
  );
};

export default Doctors;