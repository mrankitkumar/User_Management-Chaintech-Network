import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose, user }) => {
    const { updateProfile } = useContext(AuthContext);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
   

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen && user) {
            setName(user.name);
            setEmail(user.email);
            setPassword('');
            setError('');
            
        }
    }, [isOpen, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const updatedData = {
            name,
            email,
        };

        if (password) {
            updatedData.password = password;
        }

        try {
            await updateProfile(updatedData);
           
            onClose();
            alert('Updated successful!');
        } catch (error) {
            setError('Error updating profile: ' + error.message);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
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
