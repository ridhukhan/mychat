import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AppData } from '../context/AppContext'
import api from '../apiinterchapter'

const VerifyOtp = () => {
    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const { setIsAuth, setUser } = AppData()
    const navigate = useNavigate()

    const submithandler = async (e) => {
        setLoading(true)
        e.preventDefault()
        const email = localStorage.getItem("email")
        try {
            const { data } = await api.post("/user/verify", { email, otp })
            
            // accessToken localStorage এ save করো
            localStorage.setItem("accessToken", data.accessToken)
            localStorage.setItem("refreshToken", data.refreshToken)
            localStorage.removeItem("email")

            toast.success(data.message)
            setIsAuth(true)
            setUser(data.user)
            navigate("/")
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <form onSubmit={submithandler} className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">verify OTP</h2>
                        <div className="relative mb-4">
                            <label htmlFor="otp" className="leading-7 text-sm text-gray-600">otp</label>
                            <input
                                type="number"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <button
                            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                            disabled={loading}
                        >
                            {loading ? "submitting otp......." : "SUBMITT"}
                        </button>
                        <Link to={"/login"} className='text-amber-700'>go to login page</Link>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default VerifyOtp