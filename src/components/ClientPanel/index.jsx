/* ClientPanel */
import { useState } from 'react';
import './styles.css';
import Coupon from './../../api/coupon.js';
import Card from './../Card';
import GiftModel from './../GiftModel';

// ---
const PRICE = 100; // following the instructions, I assume there's an existing order of 100 shekels

// ---
export default function ClientPanel() {
  const [price, setPrice] = useState(PRICE);
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');

  // ---
  const handleApplyCoupon = async () => {
    try {
      const coupon = await Coupon.test(couponCode, appliedCoupons.length);
      setAppliedCoupons([...appliedCoupons, coupon]);
      setCouponCode('');
      await Coupon.updateUsageCount(coupon.id);
      setPrice(coupon.discountType === 'percentage' ? (price - (price * coupon.discountValue / 100)) : (price - coupon.discountValue));
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const handleCouponInputChange = (e) => {
    setCouponCode(e.target.value);
    setError('');
  };

  // ---
  return (
    <Card title="מערכת קופונים">
      <GiftModel />
      <div className="apply-coupon-container">
        <button onClick={handleApplyCoupon}>אישור</button>
        <input 
          type="text" 
          placeholder="הזן/י את קוד הקופון" 
          value={couponCode}
          onChange={handleCouponInputChange}
        />
      </div>
      { error?.length > 0 && <p className="error">{error}</p> }
      <hr />
      <div className="original-price-container">
        <span>₪{PRICE.toFixed(2)}</span>
        <span>:המחיר המקורי</span>
      </div>
      <div className="updated-price-container">
        <span>₪{price.toFixed(2)}</span>
        <span>:המחיר לאחר ההנחה</span>
      </div>
    </Card> 
  );
}