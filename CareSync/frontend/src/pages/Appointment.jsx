import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    // ✅ FETCH DOCTOR
    const fetchDocInfo = () => {
        const doc = doctors.find((doc) => doc._id === docId)
        setDocInfo(doc || null)
    }

    // ✅ GENERATE SLOTS
    const getAvailableSlots = () => {

        if (!docInfo) return

        let today = new Date()
        let allSlots = []

        for (let i = 0; i < 7; i++) {

            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0)

            if (i === 0) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {

                let formattedTime = currentDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = `${day}_${month}_${year}`

                const isBooked =
                    docInfo?.slots_booked &&
                    docInfo.slots_booked[slotDate] &&
                    docInfo.slots_booked[slotDate].includes(formattedTime)

                if (!isBooked) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            allSlots.push(timeSlots)
        }

        setDocSlots(allSlots)
    }

    // ✅ BOOK APPOINTMENT
    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        if (!slotTime) {
            return toast.error("Select a time slot")
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = `${day}_${month}_${year}`

        try {

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                { docId, slotDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo])

    return docInfo ? (
        <div>

            {/* DOCTOR DETAILS */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img
                        className='bg-primary w-full sm:max-w-72 rounded-lg'
                        src={docInfo?.image}
                        onError={(e) => (e.target.src = "/default.png")}
                        alt="doctor"
                    />
                </div>

                <div className='flex-1 border rounded-lg p-8 bg-white'>
                    <p className='text-3xl font-medium'>{docInfo.name}</p>

                    <div className='mt-2'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <p>{docInfo.experience}</p>
                    </div>

                    <p className='mt-3 text-gray-600'>{docInfo.about}</p>

                    <p className='mt-3 font-medium'>
                        Fee: {currencySymbol}{docInfo.fees}
                    </p>
                </div>
            </div>

            {/* SLOTS */}
            <div className='mt-8'>

                <div className='flex gap-3 overflow-x-scroll'>
                    {docSlots.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`p-3 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border'}`}
                        >
                            <p>{daysOfWeek[(new Date().getDay() + index) % 7]}</p>
                        </div>
                    ))}
                </div>

                <div className='flex gap-3 mt-4 overflow-x-scroll'>
                    {docSlots[slotIndex]?.map((item, index) => (
                        <p
                            key={index}
                            onClick={() => setSlotTime(item.time)}
                            className={`px-4 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'border'}`}
                        >
                            {item.time}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    className='bg-primary text-white px-6 py-3 mt-5 rounded-full'
                >
                    Book Appointment
                </button>
            </div>

            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />

        </div>
    ) : null
}

export default Appointment