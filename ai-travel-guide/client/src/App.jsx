import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import Trips from './pages/Trips'
import TripPlanner  from './pages/TripPlanner'
import Login from './pages/Login'
function App() {


  return (
    <div className=''>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/tripplanner' element={<TripPlanner />}/>
        <Route path='/trips' element={<Trips />}/>
        <Route path='/blogs' element={<Blogs />}/>
        <Route path='/Login' element={<Login/>}/>
      </Routes>
      <Footer/>
      </div>
  )
}

export default App
