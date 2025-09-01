function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Business Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.25rem' }}>
            Manage your business operations and Instagram integration
          </p>
        </header>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Organization Overview
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              View and manage your organization settings, team members, and business locations.
            </p>
            <button style={{
              backgroundColor: '#22c55e',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Manage Organization
            </button>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Business Management
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Configure your business profiles, products, services, and Instagram connections.
            </p>
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              View Businesses
            </button>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Stories & Content
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Manage Instagram stories, track engagement, and create interactive content.
            </p>
            <button style={{
              backgroundColor: '#ec4899',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Manage Stories
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
            Quick Stats
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0ea5e9' }}>3</div>
              <div style={{ color: '#6b7280' }}>Active Businesses</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>127</div>
              <div style={{ color: '#6b7280' }}>Total Stories</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3f2', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>2.3k</div>
              <div style={{ color: '#6b7280' }}>Story Views</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#64748b' }}>89%</div>
              <div style={{ color: '#6b7280' }}>Engagement Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
