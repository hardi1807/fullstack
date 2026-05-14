import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const {
        dToken,
        profileData,
        setProfileData,
        getProfileData
    } = useContext(DoctorContext)

    const {
        currency,
        backendUrl
    } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)

    // ================= UPDATE PROFILE =================
    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: Number(profileData.fees),
                about: profileData.about,
                available: profileData.available
            }

            console.log("UPDATE DATA:", updateData)
            console.log("DOCTOR TOKEN:", dToken)

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile',
                updateData,
                {
                    headers: {
                        dtoken: dToken
                    }
                }
            )

            console.log("UPDATE RESPONSE:", data)

            if (data.success) {

                toast.success(data.message)

                // update UI instantly
                setProfileData(data.updatedDoc)

                // refresh latest data
                getProfileData()

                setIsEdit(false)

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }

    }

    // ================= LOAD PROFILE =================
    useEffect(() => {

        if (dToken) {
            getProfileData()
        }

    }, [dToken])

    return profileData && (
        <div>

            <div className='flex flex-col gap-4 m-5'>

                {/* IMAGE */}
                <div>
                    <img
                        className='bg-primary/80 w-full sm:max-w-64 rounded-lg'
                        src={profileData.image}
                        alt=""
                    />
                </div>

                {/* PROFILE CARD */}
                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                    {/* NAME */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {profileData.name}
                    </p>

                    {/* DEGREE */}
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>

                        <p>
                            {profileData.degree} - {profileData.speciality}
                        </p>

                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {profileData.experience}
                        </button>

                    </div>

                    {/* ABOUT */}
                    <div>

                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
                            About :
                        </p>

                        <div className='text-sm text-gray-600 max-w-[700px] mt-1'>

                            {
                                isEdit
                                    ? (
                                        <textarea
                                            rows={8}
                                            className='w-full outline-primary p-2 border rounded'
                                            value={profileData.about}
                                            onChange={(e) =>
                                                setProfileData(prev => ({
                                                    ...prev,
                                                    about: e.target.value
                                                }))
                                            }
                                        />
                                    )
                                    : (
                                        <p>{profileData.about}</p>
                                    )
                            }

                        </div>

                    </div>

                    {/* FEES */}
                    <p className='text-gray-600 font-medium mt-4'>

                        Appointment fee:

                        <span className='text-gray-800 ml-2'>

                            {
                                isEdit
                                    ? (
                                        <input
                                            type='number'
                                            className='border px-2 py-1 rounded'
                                            value={profileData.fees}
                                            onChange={(e) =>
                                                setProfileData(prev => ({
                                                    ...prev,
                                                    fees: e.target.value
                                                }))
                                            }
                                        />
                                    )
                                    : (
                                        `${currency} ${profileData.fees}`
                                    )
                            }

                        </span>

                    </p>

                    {/* ADDRESS */}
                    <div className='flex gap-2 py-2'>

                        <p>Address:</p>

                        <div className='text-sm'>

                            {
                                isEdit
                                    ? (
                                        <>
                                            <input
                                                type='text'
                                                className='border px-2 py-1 rounded mb-2'
                                                value={profileData.address.line1}
                                                onChange={(e) =>
                                                    setProfileData(prev => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            line1: e.target.value
                                                        }
                                                    }))
                                                }
                                            />

                                            <br />

                                            <input
                                                type='text'
                                                className='border px-2 py-1 rounded'
                                                value={profileData.address.line2}
                                                onChange={(e) =>
                                                    setProfileData(prev => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            line2: e.target.value
                                                        }
                                                    }))
                                                }
                                            />
                                        </>
                                    )
                                    : (
                                        <>
                                            <p>{profileData.address.line1}</p>
                                            <p>{profileData.address.line2}</p>
                                        </>
                                    )
                            }

                        </div>

                    </div>

                    {/* AVAILABLE */}
                    <div className='flex gap-2 pt-2'>

                        <input
                            type="checkbox"
                            checked={profileData.available}
                            onChange={() =>
                                isEdit &&
                                setProfileData(prev => ({
                                    ...prev,
                                    available: !prev.available
                                }))
                            }
                        />

                        <label>Available</label>

                    </div>

                    {/* BUTTON */}
                    {
                        isEdit
                            ? (
                                <button
                                    onClick={updateProfile}
                                    className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
                                >
                                    Save
                                </button>
                            )
                            : (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
                                >
                                    Edit
                                </button>
                            )
                    }

                </div>

            </div>

        </div>
    )
}

export default DoctorProfile