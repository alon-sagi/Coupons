/* Navbar */
import { FaCopyright } from 'react-icons/fa';
import './styles.css';

// ---
export default function Navbar({ view, onClick }) {
  return (
    <div className="navbar-container">
      <div className="credit">
        <FaCopyright className="copy-right" size={16} /> 
        <span>אלון שגיא</span>
      </div>
      <button className="view-button" onClick={onClick}>{view}</button>
    </div>
  );
}