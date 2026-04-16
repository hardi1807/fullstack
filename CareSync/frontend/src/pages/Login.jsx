import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')

  const [step, setStep] = useState(1) // 1 = auth, 2 = otp
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { backendUrl, setToken, loadUserProfileData } = useContext(AppContext)

  // ================= SUBMIT (SIGNUP / LOGIN) =================
  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      // ================= SIGN UP =================
      if (state === 'Sign Up') {

        const { data } = await axios.post(
          backendUrl + '/api/user/register',
          { name, email, password }
        )

        if (data.success) {
          toast.success("OTP sent to email 📩 (Verify to complete signup)")
          setStep(2)
        } else {
          toast.error(data.message)
        }

      }

      // ================= LOGIN =================
      else {

        const { data } = await axios.post(
          backendUrl + '/api/user/login',
          { email, password }
        )

        if (data.success) {
          toast.success("OTP sent to email 📩")
          setStep(2)
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    try {
      setLoading(true)

      const { data } = await axios.post(
        backendUrl + '/api/user/verify-login',
        { email, otp }
      )

      if (data.success) {

        localStorage.setItem('token', data.token)
        setToken(data.token)

        await loadUserProfileData()

        toast.success("Login Successful 🎉")

        setStep(1)
        setName('')
        setEmail('')
        setPassword('')
        setOtp('')

        navigate('/')

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error("OTP verification failed ❌")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/')
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>

      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

        {/* TITLE */}
        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>

        <p>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {/* ================= STEP 1 (FORM) ================= */}
        {step === 1 && (
          <>
            {state === 'Sign Up' && (
              <div className='w-full'>
                <p>Full Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className='border border-[#DADADA] rounded w-full p-2 mt-1'
                  type="text"
                  required
                />
              </div>
            )}

            <div className='w-full'>
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="email"
                required
              />
            </div>

            <div className='w-full'>
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='border border-[#DADADA] rounded w-full p-2 mt-1'
                type="password"
                required
              />
            </div>

            <button
              disabled={loading}
              className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'
            >
              {loading
                ? "Sending OTP..."
                : (state === 'Sign Up' ? 'Create Account' : 'Login')}
            </button>
          </>
        )}

        {/* ================= STEP 2 (OTP UI) ================= */}
        {step === 2 && (
          <>
            <p className='text-sm text-gray-500'>
              Enter OTP sent to <b>{email}</b>
            </p>

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className='border border-[#DADADA] rounded w-full p-2 mt-1 text-center tracking-widest'
              type="text"
              placeholder="Enter OTP"
              maxLength={6}
            />

            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading}
              className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className='text-sm text-gray-500 underline'
            >
              Back
            </button>
          </>
        )}

        {/* ================= SWITCH LOGIN/SIGNUP ================= */}
        {step === 1 && (
          state === 'Sign Up' ? (
            <p>
              Already have an account?
              <span
                onClick={() => setState('Login')}
                className='text-primary underline cursor-pointer ml-1'
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create a new account?
              <span
                onClick={() => setState('Sign Up')}
                className='text-primary underline cursor-pointer ml-1'
              >
                Click here
              </span>
            </p>
          )
        )}

      </div>
    </form>
  )
}

export default Login



/*import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
 const { backendUrl, token, setToken, loadUserProfileData } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      if (state === 'Sign Up') {

        const { data } = await axios.post(
          backendUrl + '/api/user/register',
          { name, email, password }
        )

        if (data.success) {
          localStorage.setItem('token', data.token)
           setToken(data.token)

          
          await loadUserProfileData()
           toast.success("Account Created ✅")

          setName('')
          setEmail('')
          setPassword('')
        } else {
          toast.error(data.message)
        }

      } else {

        const { data } = await axios.post(
          backendUrl + '/api/user/login',
          { email, password }
        )

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)

          await loadUserProfileData()

          toast.success("Login Successful ")

          setEmail('')
          setPassword('')
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      console.log(error)
      toast.error("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>

        <p className='text-2xl font-semibold'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>

        <p>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='border border-[#DADADA] rounded w-full p-2 mt-1'
              type="text"
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type="email"
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className='border border-[#DADADA] rounded w-full p-2 mt-1'
            type="password"
            required
          />
        </div>

        <button
          disabled={loading}
          className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'
        >
          {loading
            ? "Please wait..."
            : (state === 'Sign Up' ? 'Create Account' : 'Login')}
        </button>

        {state === 'Sign Up' ? (
          <p>
            Already have an account?
            <span
              onClick={() => setState('Login')}
              className='text-primary underline cursor-pointer ml-1'
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?
            <span
              onClick={() => setState('Sign Up')}
              className='text-primary underline cursor-pointer ml-1'
            >
              Click here
            </span>
          </p>
        )}

      </div>
    </form>
  )
}

export default Login   */