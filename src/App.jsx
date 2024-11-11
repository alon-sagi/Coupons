/* App */
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import ClientPanel from './components/ClientPanel';

// ---
export default function App() {
  const [view, setView] = useState('אדמין');
  return (
    <>
      <Navbar view={view} onClick={() => setView(view === 'אדמין' ? 'לקוח קצה' : 'אדמין')} />
      <br />
      { view === 'לקוח קצה' 
        ? <AuthForm type='login' title="התחברות" /> 
        : <ClientPanel /> 
      }
    </>
  );
}
