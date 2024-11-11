/* CouponsManager */
import { useState, useEffect } from 'react';
import './styles.css';
import Coupon from './../../../api/coupon.js';
import Card from './../../Card';

// ---
const ExistingCoupons = ({ coupons, handleStartEdit, handleDeleteCoupon }) => {
  return (
    <Card title="קופונים קיימים">
      { coupons.map(coupon => (
        <div key={coupon.id} className="coupon-item">
          <h4>{ coupon.code }</h4>
          <p><span>תיאור:</span> { coupon.description }</p>
          <p><span>הנחה:</span> { coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₪${coupon.discountValue}` }</p>
          <p><span>כמות השימוש: </span> { coupon.usageCount } { coupon.maxUses ? ` מתוך ${coupon.maxUses}` : '' }</p> 
          <p><span>תאריך תפוגה:</span> { coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('he-IL') : 'אין' }</p>
          <p><span>כפל מבצעים:</span> { coupon.allowMultiple ? 'מאופשר' : 'לא מאופשר' }</p>
          <br />
          <div className="coupon-actions">
            <button onClick={() => handleStartEdit(coupon)} className="edit-coupon-button">ערוך</button>
            <button onClick={() => handleDeleteCoupon(coupon.id)} className="delete-coupon-button">מחק</button>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ---
export default function CouponsManager({ userId }) {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState('');
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    expiryDate: '',
    maxUses: null,
    allowMultiple: false,
    createdBy: userId
  });

  // ---
  const loadCoupons = async () => {
    try {
      const data = await Coupon.getAll();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const toggleView = () => {
    if(editingCoupon) {
      handleCancelEdit();
    } else {
      setIsCreatingNew(prev => !prev);
    }
  };

  // ---
  const handleStartEdit = (coupon) => {
    setEditingCoupon({
      ...coupon,
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ''
    });
    setIsCreatingNew(true);
  };

  // ---
  const handleCancelEdit = () => {
    setEditingCoupon(null);
    setIsCreatingNew(false);
    setError('');
  };

  // ---
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingCoupon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ---
  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      await Coupon.update(editingCoupon.id, editingCoupon);
      setEditingCoupon(null);
      loadCoupons();
      setIsCreatingNew(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await Coupon.create(newCoupon);
      loadCoupons();
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        expiryDate: '',
        maxUses: null,
        allowMultiple: false,
        createdBy: userId
      });
      setIsCreatingNew(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const handleDeleteCoupon = async (id) => {
    try {
      await Coupon.delete(id);
      loadCoupons();
    } catch (err) {
      setError(err.message);
    }
  };

  // ---
  const renderCouponForm = (formData, handleChange, handleSubmit, isEditing) => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>קוד</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>תיאור</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>סוג ההנחה</label>
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
        >
          <option value="percentage">אחוזים</option>
          <option value="amount">סכום</option>
        </select>
      </div>
      <div className="form-group">
        <label>ערך ההנחה</label>
        <input
          type="number"
          name="discountValue"
          min="0"
          value={formData.discountValue}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>תאריך תפוגה (אופציונלי)</label>
        <input
          type={formData.expiryDate ? "date" : "text"}
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          placeholder="ללא תאריך תפוגה"
          onFocus={(e) => e.target.type = 'date'}
          onBlur={(e) => {
            if(!e.target.value) {
              e.target.type = 'text'
            }
          }}
        />
      </div>
      <div className="form-group">
        <label>שימוש מקסימלי (אופציונלי)</label>
        <input
          type="number"
          name="maxUses"
          min="0"
          value={formData.maxUses || '' }
          placeholder="ללא הגבלה"
          onChange={handleChange}
        />
      </div>
      <div className="form-group checkbox">
        <label>
          כפל מבצעים
          <input
            type="checkbox"
            name="allowMultiple"
            checked={formData.allowMultiple}
            onChange={handleChange}
          />
        </label>
      </div>

      <br />

      <div className="form-actions">
        <button type="submit">{ isEditing ? 'עדכון' : 'צור קופון חדש' }</button>
        { isEditing && <button type="button" onClick={handleCancelEdit} className="cancel">ביטול</button> }
      </div>

    </form>
  );

  // ---
  useEffect(() => {
    loadCoupons();
  }, []);

  // ---
  return (
    <Card title="ניהול קופונים">
      { error?.message && <p className="error">{ error.message }</p> }
        
      <button onClick={toggleView}>
        { isCreatingNew ? 'כל הקופונים' : 'הוסף קופון חדש' }
      </button>

      <hr />
        
      { isCreatingNew ? (
        <Card title={ editingCoupon ? 'ערוך' : 'יצירת קופון חדש' }>
          { renderCouponForm (
            editingCoupon || newCoupon, 
            editingCoupon ? handleEditChange : (e) => {
              const { name, value, type, checked } = e.target;
              setNewCoupon(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })
            )},
            editingCoupon ? handleUpdateCoupon : handleCreateCoupon,
            !!editingCoupon
          )}
        </Card>
      ) : (
        <ExistingCoupons 
          coupons={coupons} 
          handleStartEdit={handleStartEdit} 
          handleDeleteCoupon={handleDeleteCoupon} 
        />
      )}
    </Card>
  );
}