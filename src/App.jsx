import React from 'react'

import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import {Toaster} from "sonner"
import VerifyOtp from './pages/VerifyOtp'
import { AppData } from './context/AppContext'
import Loading from './Loading'
import Verify from './pages/Verify'
import Dashboard from './pages/Dashboard'
import Allusers from './pages/Allusers'
import Conversation from './pages/Conversation'
import ForgotPass from './pages/ForgotPass'
import ResetPassword from './pages/ResetPassword'
function App() {
const {isAuth,loading}=AppData()
  return (
    <>
      {loading?(
        <Loading/>): (<BrowserRouter>
<Toaster/>
       <Routes>
        <Route  path='/' element={isAuth? <Home/>:<Login/>}/>
        <Route  path='/login' element={isAuth? <Home/>:<Login/>}/>
        <Route  path='/register' element={isAuth? <Home/>:<Register/>}/>
        <Route  path='/verifyotp' element={isAuth? <Home/>:<VerifyOtp/>}/>
        <Route  path='/token/:token' element={isAuth? <Home/>:<Verify/>}/>
        <Route  path='/dashboard' element={isAuth? <Dashboard/>:<Login/>}/>
        <Route  path='/allusers' element={isAuth? <Allusers/>:<Login/>}/>
<Route path='/chat/:id' element={isAuth?<Conversation/>:<Login/>}/>
<Route path='/forgot-password' element={<ForgotPass/>}/>
<Route path='/reset-password/:token' element={<ResetPassword/>}/>

       </Routes>
       </BrowserRouter>)}
    </>
  )
}

export default App
