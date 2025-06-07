/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { type JSX } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './app/home/page';
import Login from './app/login/page';
import Register from './app/signup/page';
import { Toaster } from 'react-hot-toast'


const isLoggedIn = () => !!localStorage.getItem('access_token');


function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster position="bottom-right" />
      
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />

         
          <Route
            path="/login"
            element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isLoggedIn() ? <Navigate to="/" replace /> : <Register />}
          />

         
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
