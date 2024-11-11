/* Reports */
import { useState } from 'react';
import './styles.css';
import Report from './../../../api/report.js';
import Card from './../../Card';

// ---
export default function Reports() {
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [error, setError] = useState('');

  // ---
  const filterReportsByUsername = async () => {
    try {
      clear();
      const data = await Report.filterByUsername(username);
      setFilteredCoupons(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const filterReportsByDates = async () => {
    try {
      clear();
      const data = await Report.filterByDates(startDate, endDate);
      setFilteredCoupons(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const exportToExcel = async () => {
    try {
      if(filteredCoupons.length > 0) {
        // Extracting just the codes into an array
        const couponCodes = filteredCoupons.map(coupon => coupon.code);
        await Report.exportExcel(couponCodes);
      } else {
        alert('אין רשימת קופונים');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // --- 
  const clear = () => {
    setError('');
    setFilteredCoupons([]);
  };

  // ---
  return (
    <Card title="צפה בדוחות">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
        <button onClick={filterReportsByUsername}>חפש לפי משתמש</button>
        <input
          type="text"
          value={username}
          placeholder="הזן/י שם משתמש"
          onChange={(e) => {
            setUsername(e.target.value);
            clear();
          }}
          style={{ textAlign: 'right' }}
        />
      </div>

      <hr />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
          <label>תאריך התחלה</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              clear();
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
          <label>תאריך סיום</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              clear();
            }}
          />
        </div>
      </div>
      <br />
      <button onClick={filterReportsByDates}>חפש לפי תאריכים</button>

      <hr />

      <div>
        <Card title="תוצאות">
          { filteredCoupons.length > 0 && 
            <ul style={{ direction: 'rtl' }}>
              { filteredCoupons.map((coupon) => <li key={coupon.id}>{coupon.code}</li>) }
            </ul> 
          }
          { error?.length > 0 && <p className="error">{error}</p> }
          <button onClick={exportToExcel}>ייצוא לאקסל</button>
        </Card>
      </div>
    </Card>
  );
}