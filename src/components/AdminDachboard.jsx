// src/components/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
    return (
        <div>
            <h2>Admin Dashboard</h2>
            <Link to="/admin/users">Manage Users</Link>
            <Link to="/admin/add-user">Add New User</Link>
        </div>
    );
}

export default AdminDashboard;
