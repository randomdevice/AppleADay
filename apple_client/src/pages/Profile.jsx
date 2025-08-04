import React from "react";

const stateSuggestions = {
  Colorado: ["Stay active! Explore hiking trails."],
  "West Virginia": ["Watch your sugar intake and get regular checkups."],
  Utah: ["Keep enjoying nutrient-rich meals!"]
};

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) return <div>Please log in.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>State:</strong> {user.state}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Suggestions for you:</h2>
        <ul className="list-disc pl-6 mt-2">
          {stateSuggestions[user.state]?.map((s, i) => (
            <li key={i}>{s}</li>
          )) || <li>No data yet for your state.</li>}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
