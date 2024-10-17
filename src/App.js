// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDachboard';
import Login from './components/Login';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserList />} />
                <Route path="/admin/add-user" element={<AddUser />} />
            </Routes>
        </Router>
    );
}

export default App;
