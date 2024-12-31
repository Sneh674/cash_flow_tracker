// import React from 'react'
import { Link } from 'react-router-dom'
import './entry2.css'

const Entry = () => {
  return (
    <div className="entry-container">
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
