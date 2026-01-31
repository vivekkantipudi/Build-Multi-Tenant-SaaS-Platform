import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [view, setView] = useState('login'); // login, register, dashboard
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subdomain, setSubdomain] = useState('');

  // Register States
  const [regData, setRegData] = useState({
    tenantName: '', subdomain: '', adminEmail: '', adminPassword: '', adminFullName: ''
  });

  // Project & User Form States
  const [projectName, setProjectName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');

  // --- ACTIONS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email, password, tenantSubdomain: subdomain
      });
      setToken(res.data.data.token);
      setUser(res.data.data.user);
      setView('dashboard');
      alert('Login Successful!');
    } catch (err) {
      alert('Login Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register-tenant`, regData);
      alert('Registration Successful! Please Login.');
      setView('login');
    } catch (err) {
      alert('Registration Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/projects`, 
        { name: projectName, description: "Created via Dashboard", status: "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Project Created Successfully!');
      setProjectName('');
    } catch (err) {
      alert('Failed to create project: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Fetch "Me" first to get the tenant ID (Workaround if login doesn't return it)
      const meRes = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const currentTenantId = meRes.data.data.tenant.id;

      await axios.post(`${API_URL}/tenants/${currentTenantId}/users`, 
        { email: newUserEmail, password: newUserPass, fullName: "New User", role: "user" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('User Added Successfully!');
      setNewUserEmail('');
      setNewUserPass('');
    } catch (err) {
      alert('Failed to add user: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- VIEWS ---

  if (view === 'login') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>SaaS Login</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            {/* CORRECT: "required" is removed for Super Admin support */}
            <input 
              style={styles.input} 
              placeholder="Subdomain (Leave empty for Super Admin)" 
              value={subdomain} 
              onChange={e => setSubdomain(e.target.value)} 
            />
            
            <input style={styles.input} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button style={styles.button} type="submit">Login</button>
          </form>
          <p style={{marginTop: '20px'}}>Don't have a company?</p>
          <button style={styles.secondaryButton} onClick={() => setView('register')}>Register New Company</button>
        </div>
      </div>
    );
  }

  if (view === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Register Company</h2>
          <form onSubmit={handleRegister} style={styles.form}>
            <input style={styles.input} placeholder="Company Name" onChange={e => setRegData({...regData, tenantName: e.target.value})} required />
            <input style={styles.input} placeholder="Subdomain (e.g., tech)" onChange={e => setRegData({...regData, subdomain: e.target.value})} required />
            <input style={styles.input} placeholder="Admin Name" onChange={e => setRegData({...regData, adminFullName: e.target.value})} required />
            <input style={styles.input} placeholder="Admin Email" onChange={e => setRegData({...regData, adminEmail: e.target.value})} required />
            <input style={styles.input} type="password" placeholder="Admin Password" onChange={e => setRegData({...regData, adminPassword: e.target.value})} required />
            <button style={styles.button} type="submit">Register</button>
          </form>
          <button style={styles.textButton} onClick={() => setView('login')}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1>Dashboard: {subdomain || "Super Admin"}</h1>
        <div>
          <span>Welcome, {user?.role}</span>
          <button style={styles.logoutBtn} onClick={() => { setToken(''); setView('login'); }}>Logout</button>
        </div>
      </header>

      <div style={styles.grid}>
        {/* Add Project Card */}
        <div style={styles.dashCard}>
          <h3>Add New Project</h3>
          <form onSubmit={handleAddProject} style={styles.form}>
            <input style={styles.input} placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} required />
            <button style={styles.button} type="submit">Create Project</button>
          </form>
        </div>

        {/* Add User Card - Only visible to Admins */}
        {(user?.role === 'tenant_admin' || user?.role === 'super_admin') && (
          <div style={styles.dashCard}>
            <h3>Add New Team Member</h3>
            <form onSubmit={handleAddUser} style={styles.form}>
              <input style={styles.input} placeholder="User Email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
              <input style={styles.input} type="password" placeholder="User Password" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} required />
              <button style={styles.button} type="submit">Add User</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple inline styles for layout
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px', textAlign: 'center' },
  dashCard: { background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flex: 1, minWidth: '300px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { padding: '8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  textButton: { marginTop: '10px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' },
  dashboard: { padding: '20px', background: '#f8f9fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
  logoutBtn: { marginLeft: '15px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'flex', gap: '20px', flexWrap: 'wrap' }
};

export default App;