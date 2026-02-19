import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../apiinterchapter'

const Allusers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true) 
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/user/users")
      setUsers(Array.isArray(data) ? data : []) 
    } catch (error) {
      console.log("Fetch users error:", error.message)
      setUsers([]) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toConversation = (user) => {
    navigate(`/chat/${user._id}`, {
      state: user
    })
  }

  return (
    <div className='h-100 shadow-[2px_7px_15px_#000] rounded-2xl ml-5 bg-black w-70 p-3 overflow-y-auto'>
      {loading ? (
        <p className="text-white text-center">Loading users...</p>
      ) : Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (
          <div
            key={user._id}
            onClick={() => toConversation(user)}
            // h-1 theke p-4 kora hoyeche jeno card-ta bhalo dekhay
            className='p-4 bg-amber-500 text-black rounded-2xl mt-3 flex items-center justify-center cursor-pointer hover:bg-amber-400 transition-all'
          >
            <h1 className="font-bold">{user.fullname}</h1>
          </div>
        ))
      ) : (
        <p className="text-white text-center">No users found or Database connection error.</p>
      )}
    </div>
  )
}

export default Allusers;