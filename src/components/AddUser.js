import React, { useState } from 'react';
import axios from 'axios';

function AddUser() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/users', { name, password }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('User added successfully');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Add User</button>
        </form>
    );
}

export default AddUser;
