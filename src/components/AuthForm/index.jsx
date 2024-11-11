/* AuthForm */
import { useState, useEffect } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import './styles.css';
import User from './../../api/user.js';
import AdminPanel from './../AdminPanel';
import Card from './../Card';

// ---
export default function AuthForm({ type, title }) { // Handles the creation of users (admins) by admin and also handles user (admin) login
  const [user, setUser] = useState({ id: null, name: '' });
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState({ message: '', type: '' });

  // ---
  const clear = () => {
    setError({ message: '', type: '' });
    setUser({ id: null, name: '' });
    setPassword('');
  }

  // --- 
  const reset = (e) => {
    e.preventDefault();
    clear();
  }

  // ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, name } = await User[type](user.name, password); // User.create | User.login
      setUser({ id, name });
      switch (type) {
        case 'login':
          setIsLoggedIn(true);
          break;
        case 'create':
          alert(`!המשתמש ${name} נוצר בהצלחה`);
          clear();
          break;    
      };
    } catch (err) {
      const { message, type } = err;
      setError({ message, type });
    }
  };

  // ---
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    setter(setter === setPassword ? value : { id: null, name: value });
    setError({ message: '', type: '' });
  };

  // ---
  const handleSession = async () => {
    try {
      const { id, name } = await User.checkSession();
      if(id && name) {
        setUser({ id, name });
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError({ message: err.message, type: '' });
    }
  };

  // Checking if a session exists when the component mounts
  useEffect(() => { 
    if(type === 'login') {
      handleSession();
    }
  }, []);

  // ---
  return type === 'login' && isLoggedIn ? (
    <AdminPanel user={user} />
  ) : (
    <Card title={title}>
      <form onSubmit={handleSubmit}>
        <div className="inputs-container">
          <div className="input-icon-container">
            <FaUser />
            <input
              type="text" 
              placeholder="הכנס/י שם משתמש" 
              value={user.name} 
              onChange={handleInputChange(setUser)} 
              className={error.type === 'username' ? 'error' : ''}
              required
            />
          </div>
          <div className="input-icon-container">
            <FaLock />
            <input 
              type="password" 
              placeholder="הכנס/י סיסמה" 
              value={password}
              onChange={handleInputChange(setPassword)}
              className={error.type === 'password' ? 'error' : ''}
              required
            />
          </div>
        </div>

        <br />
        
        <div className="buttons-container">
          <button type="submit">אישור</button>
          <button className="clear" onClick={reset}>איפוס</button>
        </div>
        
        { error?.message.length > 0 && <p className="error">{error.message}</p> }
      </form>
    </Card>
  );
}