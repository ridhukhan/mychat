import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../apiinterchapter'
const ResetPassword = () => {
const [password,setPassword]=useState("")
    const {token}=useParams()

const navigate =useNavigate()

const [loading,setLoading]=useState(false)
const submithandler=async(e)=>{
    e.preventDefault()
setLoading(true)
try {

const {data}= await api.post(`/user/reset-password/${token}`,{
    password
})

toast.success(data.message)
navigate("/login")
} catch (error) {
    console.log(error.message)
}finally{
    setLoading(false)
}

}

  return (
    <div>

<h1>Create a new Password</h1>
 <form onSubmit={submithandler} className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col
     md:ml-auto w-full mt-10 md:mt-0">
      <h2 className="text-gray-900 text-lg font-medium title-font mb-5">New Password</h2>
      
      <div className="relative mb-4">
        <label htmlFor="password" className="leading-7 text-sm text-gray-600">password</label>
        <input type="password" 
          value={password}
           onChange={(e)=>setPassword(e.target.value)} 
           className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>

     
      <button   className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
       disabled={loading}>{loading?"Sumitting pass.......":"submite"}</button>
    </form>
  






    </div>
  )
}

export default ResetPassword