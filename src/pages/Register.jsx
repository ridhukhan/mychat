import React from 'react'
import { useState } from 'react'
import api from '../apiinterchapter'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
const Register = () => {
    const [fullname,setFullname]=useState("")

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    
const submithandler=async (e)=>{
    setLoading(true)
    e.preventDefault();
try {
    const {data}=await api.post("/user/register",{
      fullname,
        email,
        password})
    toast.success(data.message)

   setFullname("")
   setEmail("")
   setPassword("")
} catch (error) {
        toast.error(error.response?.data?.message || error.message)
    
}finally{
    setLoading(false)
}


}
  return (
    <div>
        <section className="text-gray-600 body-font">
  <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
    
    <form onSubmit={submithandler} className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col
     md:ml-auto w-full mt-10 md:mt-0">
      <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Login</h2>
      <div className="relative mb-4">
        <label htmlFor="fullname" className="leading-7 text-sm text-gray-600">Full Name</label>
        <input type="text" 
        id="fullname"
         name="fullname"
          value={fullname}
           onChange={(e)=>setFullname(e.target.value)} 
           className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <div className="relative mb-4">
        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
        <input type="email" 
        id="email"
         name="email"
          value={email}
           onChange={(e)=>setEmail(e.target.value)} 
           className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>

      <div className="relative mb-4">
        <label htmlFor="password" className="leading-7 text-sm text-gray-600">PASSWORD</label>
        <input type="password" id="password" name="password"
          value={password}
           onChange={(e)=>setPassword(e.target.value)} 
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none
         text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
      </div>
      <button   className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
       disabled={loading}>{loading?"submitting data.......":"REGISTER"}</button>
   <Link to={"/login"} className='text-amber-700'>Don't have an Account??</Link>
    </form>
  </div>
</section>
    </div>
  )
}

export default Register