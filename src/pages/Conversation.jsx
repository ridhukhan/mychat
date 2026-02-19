import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { MdSend } from "react-icons/md";
import { useSocket } from '../context/SocketContext';
import api from '../apiinterchapter'; // ✅ এখানে api import
import Loading from '../Loading';

const Conversation = () => {
  const { id } = useParams()
  const location = useLocation()
  const [receiver, setReceiver] = useState(location.state || null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef()
  const { socket } = useSocket()

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!receiver) {
        try {
          const res = await api.get(`/user/profile/${id}`)
          setReceiver(res.data)
        } catch (err) {
          console.log("Receiver fetch error:", err)
        }
      }
    }
    fetchReceiver()
  }, [id, receiver])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messsages/messages/${id}`)
        setMessages(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.log("Messages fetch error:", err)
        setMessages([])
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [id])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId === id || newMessage.receiverId === id) {  
        setMessages(prev => [...prev, newMessage])
      }
    }

    socket.on("newMessage", handleNewMessage)
    return () => socket.off("newMessage", handleNewMessage)
  }, [socket, id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim()) return
    try {
      const { data } = await api.post(`/messsages/send/${id}`, { message: text })
      setMessages(prev => [...prev, data])
      setText("")
    } catch (error) {
      console.log("Send message error:", error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className='h-100 cursor-pointer shadow-[2px_7px_15px_#000] rounded-2xl ml-5 bg-black w-70 flex flex-col'>
      <h2 className='bg-amber-300 p-2'>TO: {receiver?.fullname || "Loading..."}</h2>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {Array.isArray(messages) && messages.map(msg => (
          <div
            key={msg._id}
            className={`max-w-xs p-2 rounded-xl ${
              msg.senderId === id
                ? "bg-gray-600 text-white"
                : "bg-amber-500 ml-auto"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className='flex p-2 mt-auto bg-gray-100'>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className='flex-1 bg-white p-2 rounded-l-2xl outline-none'
        />
        <button
          onClick={sendMessage}
          className='bg-amber-400 p-2 rounded-r-2xl flex items-center justify-center'
        >
          <MdSend size={20} />
        </button>
      </div>
    </div>
  )
}

export default Conversation
