import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const { user, token, getProfile, logout,activeChanged } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const fetchProfile = async () => {
                try {
                    const response = await getProfile();
                    setProfile(response.user);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            };
            fetchProfile();
        } else {
            navigate("/");
        }
    }, [activeChanged]);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        getProfile(); // Refresh profile data after editing
    };

    return (
        <div className="container mt-5">
            {profile ? (
                <div className="card profile-card shadow">
                    <div className="card-body">
                        <h1 className="card-title">Welcome, {profile.name}</h1>
                        <p className="card-text">Email: {profile.email}</p>
                        <button className="btn btn-primary" onClick={handleEditClick}>
                            Edit Profile
                        </button>
                        <button className="btn btn-danger ml-2" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <h1>Please log in</h1>
            )}
            <EditProfileModal isOpen={isModalOpen} onClose={handleModalClose} user={profile} />
        </div>
    );
};

export default Profile;
