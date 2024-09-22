import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose, user }) => {
    const { updateProfile } = useContext(AuthContext);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');

    // Use effect to reset form when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name);
            setEmail(user.email);
            setPassword(''); // Clear password field
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedData = {
            name,
            email,
        };

        if (password) {
            updatedData.password = password; // Include password if provided
        }

        try {
            await updateProfile(updatedData); // Send all the data in one request
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password (leave blank to keep unchanged)</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary">Save Changes</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditProfileModal;
