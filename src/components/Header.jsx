import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const { isAuthenticated, logout, updateProfile, deleteProfile, currentUser } = useAuth()
  const location = useLocation()

  const handleEditProfile = () => {
    // For simplicity, prompt user for new username and email
    const newUsername = prompt('Enter new username:', currentUser?.username || '')
    const newEmail = prompt('Enter new email:', currentUser?.email || '')
    if (newUsername && newEmail) {
      updateProfile({ username: newUsername, email: newEmail })
        .then(() => alert('Profile updated successfully'))
        .catch(err => alert('Failed to update profile: ' + err.message))
    }
  }

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      deleteProfile()
        .then(() => alert('Profile deleted. You will be logged out.'))
        .catch(err => alert('Failed to delete profile: ' + err.message))
    }
  }

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#4CAF50', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>FitTracker</Link>
      {isAuthenticated ? (
        <>
          <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? '#FFD700' : 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/profile" style={{ color: location.pathname === '/profile' ? '#FFD700' : 'white', textDecoration: 'none' }}>Profile</Link>
        
          <button onClick={logout} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: location.pathname === '/login' ? '#FFD700' : 'white', textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ color: location.pathname === '/register' ? '#FFD700' : 'white', textDecoration: 'none' }}>Register</Link>
        </>
      )}
    </nav>
  )
}

export default Header
