import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import "./Profile.css";
import logo from "../Assets/logo.png";
import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaUser, FaEdit } from "react-icons/fa";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedAddress, setEditedAddress] = useState({
        houseNo: '',
        street: '',
        city: ''
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                console.log('Profile data:', response.data); // Debug log
                setUserData(response.data);
                if (response.data?.address) {
                    setEditedAddress(response.data.address);
                }
                setLoading(false);
            } catch (err) {
                console.error('Profile fetch error:', err); // Debug log
                setError(err.response?.data?.message || 'Failed to fetch profile data');
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchUserData();
        } else {
            setError('No authentication token found');
            setLoading(false);
        }
    }, [user]);

    const handleAddressUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/update-address`,
                editedAddress,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            );
            setUserData(prevData => ({ ...prevData, address: response.data.user.address }));
            setIsEditing(false);
            setError('');
        } catch (err) {
            console.error('Address update error:', err); // Debug log
            setError(err.response?.data?.message || 'Failed to update address');
        }
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-message">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="profile-page">
                <div className="error-message">No profile data available</div>
            </div>
        );
    }

    const renderAddress = () => {
        if (!userData.address) {
            return <p>No address provided</p>;
        }

        const { houseNo, street, city } = userData.address;
        if (!houseNo && !street && !city) {
            return <p>No address provided</p>;
        }

        return (
            <p>
                {houseNo && `${houseNo}, `}
                {street && `${street}, `}
                {city}
            </p>
        );
    };

    return (
        <div className="profile-page">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-left">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="nav-right">
                    <button onClick={() => navigate("/customer-home")} className="nav-button home-btn">
                        Home
                    </button>
                    <button onClick={() => navigate("/mycart")} className="nav-button mycart-btn">
                        My Cart
                    </button>
                </div>
            </nav>

            <div className="profile-container">
                <div className="profile-card">
                    <h2>My Profile</h2>
                    
                    <div className="profile-info">
                        <div className="info-group">
                            <FaUser className="info-icon" />
                            <div className="info-content">
                                <label>Name:</label>
                                <p>{userData.name || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="info-group">
                            <FaEnvelope className="info-icon" />
                            <div className="info-content">
                                <label>Email:</label>
                                <p>{userData.email || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="info-group">
                            <FaPhone className="info-icon" />
                            <div className="info-content">
                                <label>Phone:</label>
                                <p>{userData.phone || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="info-group">
                            <FaMapMarkerAlt className="info-icon" />
                            <div className="info-content">
                                <label>Address:</label>
                                {isEditing ? (
                                    <form onSubmit={handleAddressUpdate} className="address-form">
                                        <input
                                            type="text"
                                            placeholder="House No"
                                            value={editedAddress.houseNo || ''}
                                            onChange={(e) => setEditedAddress({
                                                ...editedAddress,
                                                houseNo: e.target.value
                                            })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Street"
                                            value={editedAddress.street || ''}
                                            onChange={(e) => setEditedAddress({
                                                ...editedAddress,
                                                street: e.target.value
                                            })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="City"
                                            value={editedAddress.city || ''}
                                            onChange={(e) => setEditedAddress({
                                                ...editedAddress,
                                                city: e.target.value
                                            })}
                                            required
                                        />
                                        <div className="address-buttons">
                                            <button type="submit" className="save-btn">Save</button>
                                            <button 
                                                type="button" 
                                                className="cancel-btn"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditedAddress(userData.address || { houseNo: '', street: '', city: '' });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="address-display">
                                        {renderAddress()}
                                        <button 
                                            className="edit-btn"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <FaEdit /> Edit Address
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
