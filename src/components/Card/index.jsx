/* Card */
import './styles.css';

// ---
export default function Card({ title, header, children }) {
  return (
    <div className="card-container">
      <div className="content">
        { title && <h2 className="title">{title}</h2> }
        { header && <p className="header">{header}</p> }
        {children}
      </div>
    </div>
  );
}