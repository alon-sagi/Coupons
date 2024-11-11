/* api/report.js */
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import User from './user.js';
import Coupon from './coupon.js';
import { errorMessage, errorHandler } from './../utils/error-handler.js';

const Reports = { 
  // ---
  async filterByDates(startDate, endDate) {
    try {
      errorMessage('יש לבחור תאריך התחלה', !startDate);

      if(!endDate) { // If no endDate treating, setting endDate as today's date
        endDate = new Date();
      }

      // Getting all coupons
      const coupons = await Coupon.getAll();
      errorMessage('לא קיימים קופונים במסד הנתונים', !coupons || coupons.length === 0);

      // Filtering coupons started at startDate and ended at endData
      const filteredCoupons = coupons.filter((coupon) => {
        // Converting dates to YYYY-MM-DD format for comparison
        const couponDate = new Date(coupon.createdAt).toISOString().split('T')[0];
        const start = new Date(startDate).toISOString().split('T')[0];
        const end = new Date(endDate).toISOString().split('T')[0];
        return couponDate >= start && couponDate <= end;
      });

      errorMessage('אין תוצאות עבור התאריכים שנבחרו', filteredCoupons.length === 0);
      return filteredCoupons;
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async filterByUsername(username) {
    try {
      errorMessage('יש לבחור שם משתמש', !username || username.length === 0);

      // Finding the user id
      const userId = await User.getIdByUsername(username);
      errorMessage('שם המשתמש לא קיים', !userId);
      
      // Getting all coupons
      const coupons = await Coupon.getAll();
      errorMessage('לא קיימים קופונים במסד הנתונים', !coupons || coupons.length === 0);

      // Filtering coupons by user id
      const filteredCoupons = coupons.filter(coupon => coupon.createdBy === userId);
      errorMessage('לא נמצאו תוצאות עבור שם המשתמש שנבחר', filteredCoupons.length === 0);
      return filteredCoupons;
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async exportExcel(couponCodes) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Coupons');
    
    worksheet.columns = [{ header: 'קוד קופון', key: 'code', width: 20 }]; // Adding a single column for coupon codes
    couponCodes.forEach(code => worksheet.addRow({ code: code })); // Adding each code as a separate row
  
    // Saving file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Coupons_Report.xlsx');
  },
};

// ---
export default Reports;