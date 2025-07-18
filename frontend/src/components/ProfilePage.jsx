import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:5000';

function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(res.data);
    } catch {
      toast.error('Failed to load profile');
    }
  };

  return (
    <section>
      <h2>Profile</h2>
      {userDetails ? (
        <div className="user-card">
          <img src={userDetails.profileImage || '/default-avatar.png'} alt="User" />
          <div>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Phone:</strong> {userDetails.phone || 'N/A'}</p>
            <p><strong>Address:</strong> {userDetails.address || 'N/A'}</p>
            <p><strong>Joined:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : <p>Loading profile...</p>}
    </section>
  );
}

export default ProfilePage;
