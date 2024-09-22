import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiPath } from '../constant';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [activeChanged, setActiveChanged] = useState(false);

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${apiPath}/api/auth/register`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error during registration:', error.message);
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${apiPath}/api/auth/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            setToken(responseData.token);
            localStorage.setItem('token', responseData.token);
            return responseData;
        } catch (error) {
            console.error('Error during login:', error.message);
            throw error;
        }
    };

    const getProfile = async () => {
        try {
            const response = await fetch(`${apiPath}/api/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {

                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
          
            setActiveChanged(true); 
            console.log(responseData);
            return responseData;
        } catch (error) {
            console.error('Error fetching profile:', error.message);
            throw error;
        }
    };

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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error updating profile:', error.message);
            throw error;
        }
    };

    const logout = () => {
      
        setToken('');
        localStorage.removeItem('token');
        
    };

    useEffect(() => {
        if (token) {
            getProfile();
        } 
    }, [token]);

    return (
        <AuthContext.Provider value={{  token, activeChanged, register, login, getProfile, updateProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
