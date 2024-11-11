/* api/coupon.js */
import { COUPONS_URL } from './../utils/constants.js';
import { errorMessage, errorHandler } from './../utils/error-handler.js';

const Coupon = {
  // ---
  async getAll() {
    try {
      const response = await fetch(COUPONS_URL);
      errorMessage(`שגיאה (${response.status})`, !response.ok);
      return await response.json();
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async test(code, appliedCouponsLength) {
    try {
      errorMessage('יש להזין קוד קופון', !code || code.trim().length === 0);

      const response = await fetch(`${COUPONS_URL}?code=${code}`);
      errorMessage(`שגיאה (${response.status})`, !response.ok)

      const couponData = (await response.json())[0];
      errorMessage('קוד הקופון שגוי', !couponData);
      errorMessage('קוד הקופון פג תוקף', couponData.expiryDate && new Date(couponData.expiryDate) < new Date());
      errorMessage('קוד הקופון הגיע לתקרת כמות הפעמים שניתן להשתמש בו');
      errorMessage('לא ניתן לבצע כפל מבצעים עם קופון זה', !couponData.allowMultiple && appliedCouponsLength > 0);
      return couponData;
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async create(couponData) {
    try {
      const response = await fetch(COUPONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...couponData,
          createdAt: new Date().toISOString(),
          usageCount: 0
        }),
      });
      errorMessage(`שגיאה (${response.status})`, !response.ok);
      return await response.json();
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async update(id, couponData) {
    try {
      const response = await fetch(`${COUPONS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });
      errorMessage(`שגיאה (${response.status})`, !response.ok);
      return await response.json();
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async delete(id) {
    try {
      const response = await fetch(`${COUPONS_URL}/${id}`, {
        method: 'DELETE',
      });
      errorMessage(`שגיאה (${response.status})`, !response.ok);
      return true;
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async updateUsageCount(id) {
    try {
      const response = await fetch(`${COUPONS_URL}/${id}`);
      errorMessage(`שגיאה (${response.status})`, !response.ok);

      const coupon = await response.json();      
      const updateResponse = await fetch(`${COUPONS_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usageCount: coupon.usageCount + 1 }),
      });

      errorMessage(`שגיאה (${updateResponse.status})`, !updateResponse.ok);
      return await updateResponse.json();
    } catch (error) {
      errorHandler(error);
    }
  }
};

// ---
export default Coupon;