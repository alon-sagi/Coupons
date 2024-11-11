/* AdminPanel */
import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './styles.css';
import User from './../../api/user.js';
import Card from './../Card';
import AuthForm from './../AuthForm';
import Reports from './Reports';
import CouponsManager from './CouponsManager';

// ---
export default function AdminPanel({ user }) {
  const [view, setView] = useState();
  return (
    <>
      { view && 
        <button onClick={() => setView()} className="back-button">
          <FaArrowRight />
        </button>
      }
      { !view && 
        <>
          <Card title="פאנל ניהול" header={ `.${user.name} ,שלום` }>
            <hr />
            <div className='panel-buttons-container'>
              <button onClick={() => setView('users')}>צור משתמש</button>
              <button onClick={() => setView('reports')}>צפה בדוחות</button>
              <button onClick={() => setView('coupons')}>נהל קופונים</button>
            </div>
          </Card>
          <button className="logout-button" onClick={User.logout}>התנתק</button>
        </>
      }
      { view === 'users' && <AuthForm type='create' title="צור משתמש" /> }
      { view === 'reports' && <Reports /> }
      { view === 'coupons' && <CouponsManager userId={user.id} /> }
    </>
  );
}
