/* error-handler.js */

// ---
const errorMessage = (message, condition, type) => {
  if(condition) {
    throw { message, type };
  }
}
    
// ---
const errorHandler = (error) => {
  if(!error.message) { // If it's not our custom errors, it's an unexpected error
    console.error(error);
    throw { message: `שגיאה (${error.status})` };
  }
  throw error;
}
    
// ---
export { 
  errorMessage, 
  errorHandler 
};