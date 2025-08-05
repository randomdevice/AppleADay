import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { states } from "../../../apple_server/src/testing_data/state_storage.js"; // Adjust the import path as necessary
import fs from "fs"; // only works in dev/electron — you’ll fake it in the browser later

const Signup = () => {
  const [form, setForm] = useState({ name: "", state: "", username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    // Simulated user save
    let existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    existingUsers.push(form);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    localStorage.setItem("currentUser", JSON.stringify(form));
    navigate("/profile");
  };

  return (
    <div className="p-10 max-w-md mx-auto mt-20 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input name="name" placeholder="Name" className="input" onChange={handleChange} />
      <select name="state" className="input mt-2" onChange={handleChange}>
        <option value="">Select State</option>
        {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
      </select>
      <input name="username" placeholder="Username" className="input mt-2" onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" className="input mt-2" onChange={handleChange} />
      <button className="btn mt-4" onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
