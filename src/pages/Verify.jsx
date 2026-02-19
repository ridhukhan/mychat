import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'
import api from '../apiinterchapter'
const Verify = () => {
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage,setErrorMessage]=useState("")
  const params = useParams()
const [loading,setLoading] = useState(false)
  async function verifyUser(){
    try {
      const {data}= await api.post(`/user/verify/${params.token}`)
      setSuccessMessage(data.message)

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Verification Link Expired")
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    verifyUser()
  },[params.token])

  return (
   <>
   {
    loading?(<Loading/>):(

      <div className='w-[400px] m-auto mt-40'>
      {successMessage &&  (<p className='text-green-500 text-3xl'>
{successMessage}
        </p>)}

          {errorMessage &&  (<p className='text-red-500 text-3xl'>
{errorMessage}
        </p>)}
      </div>
    )

   }
   
   </>
  )
}

export default Verify