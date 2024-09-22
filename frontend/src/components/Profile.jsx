import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const {  token, getProfile, logout, activeChanged } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profile, setProfile] = useState({});
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) 
        {
            const fetchProfile = async () => {
                try {
                    const response = await getProfile();
                    setProfile(response.user);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    if (error.message.includes("401")) {
                        logout(); 
                        navigate("/"); 
                    }
                }
            };
            fetchProfile();
        } 
        else 
        {
            navigate("/");
        }
    }, [refresh,token]);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setRefresh(prev => !prev);
        
    };

    return (
        <div className="container mt-5 profile-container">
            {profile ? (
                <div className="card profile-card shadow">
                    <div className="card-body">
                        <h1 className="card-title text-center">Welcome, {profile.name}</h1>
                        <p className="card-text text-center">Email: {profile.email}</p>
                        <div className="text-center">
                            <button className="btn btn-primary" onClick={handleEditClick}>
                                Edit Profile
                            </button>
                            <button className="btn btn-danger ml-2" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <h1 className="text-center">Please log in</h1>
            )}
            <EditProfileModal isOpen={isModalOpen} onClose={handleModalClose} user={profile} />
        </div>
    );
};

export default Profile;
