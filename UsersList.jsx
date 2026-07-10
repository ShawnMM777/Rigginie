import { useState, useEffect } from 'react';
import { usersAPI } from './brigginie/src/services/api';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(formData);
      setFormData({ 
        firstname: '', 
        lastname: '', 
        email: '', 
        contact: '', 
        password: '' 
      });
      setShowForm(false);
      fetchUsers();
      alert('User added successfully!');
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error adding user: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (err) {
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-container">
      <h1>Users Management</h1>
      
      <button 
        className="btn-primary" 
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : '+ Add New User'}
      </button>

      {showForm && (
        <form className="user-form" onSubmit={handleSubmit}>
          <h2>Add New User</h2>
          <input type="text"name="firstname"placeholder="First Name"value={formData.firstname}onChange={handleInputChange}required/>
          <input type="text"name="lastname" placeholder="Last Name"value={formData.lastname} onChange={handleInputChange}required/>
          <input type="email"name="email"placeholder="Email"value={formData.email}onChange={handleInputChange}required/>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"           // ← New
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          
          <button type="submit" className="btn-primary">Add User</button>
        </form>
      )}

      {/* Rest of your table code remains the same */}
      <div className="users-list">
        <h2>All Users ({users.length})</h2>
        {users.length === 0 ? (
          <p>No users found. Add your first user!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.contact}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UsersList;