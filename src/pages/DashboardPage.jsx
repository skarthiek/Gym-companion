import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import axios from 'axios'

function DashboardPage() {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    height: '',
    weight: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const API_URL = 'https://gym-companion.onrender.com/api'
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const calculateBMI = async (e) => {
    e.preventDefault()
    
    // Validate input
    if (!formData.height || !formData.weight) {
      setError('Please enter both height and weight')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.post(`${API_URL}/bmi`, {
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      })
      
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate BMI')
      console.error('BMI calculation error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Format card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },

    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  }
  
  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          Welcome, {currentUser?.username || 'User'}!
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
          Track your fitness progress and get personalized recommendations
        </p>
      </motion.div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <motion.div 
          className="card"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <h2 className="card-title">BMI Calculator</h2>
          
          <form onSubmit={calculateBMI}>
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
                placeholder="e.g., 170"
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
                placeholder="e.g., 70"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="btn btn-block" 
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Calculating...' : 'Calculate BMI'}
            </button>
          </form>
        </motion.div>
        
        {result && (
          <motion.div 
            className="card"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="card-title">Your BMI Results</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#4CAF50',
                textAlign: 'center',
                margin: '1rem 0'
              }}>
                {result.bmi.toFixed(1)}
              </p>
              
              <p style={{ 
                textAlign: 'center', 
                fontWeight: 'bold',
                color: (() => {
                  switch(result.category) {
                    case 'Underweight': return '#FFC107';
                    case 'Normal': return '#4CAF50';
                    case 'Overweight': return '#FF9800';
                    case 'Obese': return '#F44336';
                    default: return '#333';
                  }
                })()
              }}>
                {result.category}
              </p>
            </div>
            
            <div style={{ 
              height: '24px', 
              backgroundColor: '#eee', 
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{ 
                width: '25%', 
                height: '100%', 
                backgroundColor: '#FFC107',
                float: 'left'
              }}></div>
              <div style={{ 
                width: '25%', 
                height: '100%', 
                backgroundColor: '#4CAF50',
                float: 'left'
              }}></div>
              <div style={{ 
                width: '25%', 
                height: '100%', 
                backgroundColor: '#FF9800',
                float: 'left'
              }}></div>
              <div style={{ 
                width: '25%', 
                height: '100%', 
                backgroundColor: '#F44336',
                float: 'left'
              }}></div>
              
              <div style={{
                position: 'absolute',
                left: `${Math.min(Math.max((result.bmi - 16) * 100 / 24, 0), 100)}%`,
                top: 0,
                width: '8px',
                height: '24px',
                backgroundColor: '#333',
                transform: 'translateX(-50%)',
                borderRadius: '4px'
              }}></div>
            </div>
            
            <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </motion.div>
        )}
      </div>
      
      {result && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem'
        }}>
          <motion.div 
            className="card"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="card-title">Recommended Diet Plan</h2>
            
            <div className="card-content">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#4CAF50' }}>Based on your BMI: {result.category}</h3>
              
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Morning:</h4>
                <p>{result.recommendations.diet.morning}</p>
                
                <h4 style={{ fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#555' }}>10-11 AM Snack:</h4>
                <p>{result.recommendations.diet.morningSnack}</p>
                
                <h4 style={{ fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#555' }}>Afternoon:</h4>
                <p>{result.recommendations.diet.afternoon}</p>
                
                <h4 style={{ fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#555' }}>5-6 PM Snack:</h4>
                <p>{result.recommendations.diet.eveningSnack}</p>
                
                <h4 style={{ fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#555' }}>Dinner:</h4>
                <p>{result.recommendations.diet.dinner}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="card"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <h2 className="card-title">Exercise Routine</h2>
            
            <div className="card-content">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#4CAF50' }}>Recommended Workout Plan</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Upper Body:</h4>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {result.recommendations.exercise.upperBody.map((exercise, index) => (
                    <li key={index} style={{ marginBottom: '0.3rem' }}>{exercise}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#555' }}>Lower Body:</h4>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {result.recommendations.exercise.lowerBody.map((exercise, index) => (
                    <li key={index} style={{ marginBottom: '0.3rem' }}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage