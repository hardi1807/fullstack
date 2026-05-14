import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // ================= TOKEN =================
    const [dToken, setDToken] = useState(
        localStorage.getItem('dToken') || ''
    )

    console.log("DOCTOR TOKEN CONTEXT:", dToken)

    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // ================= KEEP TOKEN UPDATED =================
    useEffect(() => {

        const token = localStorage.getItem("dToken")

        console.log("LOCAL STORAGE TOKEN:", token)

        if (token) {
            setDToken(token)
        }

    }, [])

    // ================= GET APPOINTMENTS =================
    const getAppointments = async () => {

        try {

            console.log("GET APPOINTMENTS TOKEN:", dToken)

            const { data } = await axios.get(
                backendUrl + '/api/doctor/appointments',
                {
                    headers: {
                        dToken: dToken
                    }
                }
            )

            console.log("APPOINTMENTS RESPONSE:", data)

            if (data.success) {

                setAppointments(data.appointments.reverse())

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }
    }

    // ================= GET PROFILE =================
    const getProfileData = async () => {

        try {

            console.log("PROFILE TOKEN:", dToken)

            const { data } = await axios.get(
                backendUrl + '/api/doctor/profile',
                {
                    headers: {
                        dtoken: dToken
                    }
                }
            )

            console.log("PROFILE RESPONSE:", data)

            if (data.success) {

                setProfileData(data.profileData)

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }
    }

    // ================= CANCEL APPOINTMENT =================
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/doctor/cancel-appointment',
                { appointmentId },
                {
                    headers: {
                        dtoken: dToken
                    }
                }
            )

            if (data.success) {

                toast.success(data.message)

                getAppointments()
                getDashData()

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }
    }

    // ================= COMPLETE APPOINTMENT =================
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/doctor/complete-appointment',
                { appointmentId },
                {
                    headers: {
                        dtoken: dToken
                    }
                }
            )

            if (data.success) {

                toast.success(data.message)

                getAppointments()
                getDashData()

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }
    }

    // ================= DASHBOARD =================
    const getDashData = async () => {

        try {

            const { data } = await axios.get(
                backendUrl + '/api/doctor/dashboard',
                {
                    headers: {
                        dtoken: dToken
                    }
                }
            )

            console.log("DASHBOARD RESPONSE:", data)

            if (data.success) {

                setDashData(data.dashData)

            } else {

                toast.error(data.message)

            }

        } catch (error) {

            console.log(error)
            toast.error(error.message)

        }
    }

    // ================= CONTEXT VALUE =================
    const value = {

        dToken,
        setDToken,

        backendUrl,

        appointments,
        getAppointments,

        cancelAppointment,
        completeAppointment,

        dashData,
        getDashData,

        profileData,
        setProfileData,

        getProfileData,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider