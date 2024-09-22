import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiPath } from '../constant';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const  [activeChanged, setactiveChanged]=useState(false)

   
    const register = async (name, email, password) => {
       
        try {
            const response = await fetch(`${apiPath}/api/auth/register`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
           
            return responseData;
        } catch (error) {
            console.error("Error during registration:", error.message);
            throw error; 
        }
    };


    const login = async (email, password) => {
       
        try {
            const response = await fetch(`${apiPath}/api/auth/login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            setToken(responseData.token);
            localStorage.setItem('token', responseData.token);
           
            return responseData;
        } catch (error) {
            console.error("Error during login:", error.message);
            throw error; 
        }
    };

   
    const getProfile = async () => {
        setactiveChanged(false);
        try {
            const response = await fetch(`${apiPath}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            setUser(responseData);
            setactiveChanged(true);
            return responseData;
        } catch (error) {
            console.error("Error fetching profile:", error.message);
            throw error; 
        }
    };

    // Function to update the user profile
    const updateProfile = async (updatedData) => {
       
        try {
            const response = await fetch(`${apiPath}/api/auth/profile`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });
    
            const responseData = await response.json();
            setUser(responseData);
           
            return responseData;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error; 
        }
    };
    
    // Function to log out the user
    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
    };

    
    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token,activeChanged, register, login, getProfile, updateProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
