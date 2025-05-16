import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '2rem 0',
      marginTop: 'auto',
      borderTop: '1px solid #eaeaea'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span role="img" aria-label="Fitness" style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
            🏋️‍♂️
          </span>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#4CAF50' }}>
            FitTracker
          </span>
        </div>
        
        <nav style={{ marginBottom: '1.5rem' }}>
          <ul style={{
            display: 'flex',
            gap: '1.5rem',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <li>
              <Link to="/" style={{
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.3s',
                '&:hover': { color: '#4CAF50' }
              }}>
                Home
              </Link>
            </li>
            <li>
              <a href="#" style={{
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.3s',
                '&:hover': { color: '#4CAF50' }
              }}>
                About
              </a>
            </li>
            <li>
              <a href="#" style={{
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.3s',
                '&:hover': { color: '#4CAF50' }
              }}>
                Terms
              </a>
            </li>
            <li>
              <a href="#" style={{
                color: '#555',
                textDecoration: 'none',
                transition: 'color 0.3s',
                '&:hover': { color: '#4CAF50' }
              }}>
                Privacy
              </a>
            </li>
          </ul>
        </nav>
        
        <p style={{
          fontSize: '0.875rem',
          color: '#888',
          textAlign: 'center',
          margin: 0
        }}>
          © {currentYear} FitTracker. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer