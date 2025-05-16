import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

function ProfilePage() {
  const { currentUser, updateProfile, deleteProfile, error } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const navigate = useNavigate()
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        height: currentUser.height || '',
        weight: currentUser.weight || ''
      })
    }
  }, [currentUser])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleEdit = () => {
    setIsEditing(true)
    setSuccessMessage('')
  }
  
  const handleCancelEdit = () => {
    // Reset form to original data
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        height: currentUser.height || '',
        weight: currentUser.weight || ''
      })
    }
    setIsEditing(false)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await updateProfile(formData)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Profile update error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteRequest = () => {
    setConfirmDelete(true)
  }
  
  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }
  
  const handleConfirmDelete = async () => {
    setIsSubmitting(true)
    
    try {
      await deleteProfile()
      navigate('/login')
    } catch (err) {
      console.error('Profile deletion error:', err)
    } finally {
      setIsSubmitting(false)
      setConfirmDelete(false)
    }
  }
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          Your Profile
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
      >
        {error && (
          <div className="error-message" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem'
          }}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                className="form-control"
                value={formData.height}
                onChange={handleChange}
                min="50"
                max="250"
                step="0.1"
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="form-control"
                value={formData.weight}
                onChange={handleChange}
                min="20"
                max="300"
                step="0.1"
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: isEditing ? 'space-between' : 'flex-end',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {isEditing ? (
              <>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={handleCancelEdit}
                  style={{ backgroundColor: '#f5f5f5', color: '#333' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={handleEdit}
                  style={{ backgroundColor: '#2196F3' }}
                >
                  Edit Profile
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={handleDeleteRequest}
                  style={{ backgroundColor: '#F44336' }}
                >
                  Delete Account
                </button>
              </>
            )}
          </div>
        </form>
        
        {confirmDelete && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '90%',
                width: '400px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <h2 style={{ marginBottom: '1rem', color: '#F44336' }}>Delete Account</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button 
                  className="btn" 
                  onClick={handleCancelDelete}
                  style={{ backgroundColor: '#f5f5f5', color: '#333' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn" 
                  onClick={handleConfirmDelete}
                  style={{ backgroundColor: '#F44336' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default ProfilePage