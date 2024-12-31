// import React from 'react'
import { Link } from 'react-router-dom'

const Entry = () => {
  return (
    <div style={{"display":"flex", flexDirection:"column", alignItems: "center"}}>
      <h1>
        Cash Flow Tracker
      </h1>
      <h2>Track your money with ease</h2>
      <div className="btnsEntry">
        {/* <button>Log In</button>
        <button>Sign Up</button> */}
        <Link to="/login">Log In</Link>
        <Link to="/register">Sign Up</Link>
      </div>
    </div>
  )
}

export default Entry
