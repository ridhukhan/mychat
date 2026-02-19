import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../apiinterchapter'

const Dashboard = () => {
const [content,setContent]=useState("")
  async function fetchAdminData(){
    try {
   const {data}  = await api.get(`/user/admin`,{
    withCredentials:true,
   })
   
  setContent(data.message)
  
  } 
    
    catch (error) {
      toast.error(error.response.data.message)
    }
  }
  useEffect(()=>{
     fetchAdminData()
  },[])
  return (
  <>
  {
    content &&   <div>{content}</div>
  }
  </>
  )
}

export default Dashboard