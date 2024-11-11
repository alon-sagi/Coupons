/* api/user.js */
import { USERS_URL, SESSIONS_URL } from './../utils/constants.js';
import { errorMessage, errorHandler } from './../utils/error-handler.js';

const User = {
  // ----
  async login(username, password) {
    try {
      errorMessage('יש למלא את כל השדות', !username || !password, !username ? 'username' : 'password');

      // Fetching the user with data the given username
      const response = await fetch(`${USERS_URL}?name=${username}`);
      errorMessage(`שגיאה (${response.status})`, !response.ok);

      const user = (await response.json())[0];
      errorMessage('המשתמש לא קיים', !user, 'username');
      errorMessage('הסיסמה שגויה', password !== user.password, 'password'); // Direct password comparison (Ideally, should use a secure hashing method (like bcrypt) to compare the password)
        
      // Deleting for enhanced security
      password = '';
      delete user.password;

      // New session object
      const newSession = {
        id: Math.random().toString(36).substring(2) + Date.now().toString(36),
        userId: user.id,
        lastAccess: new Date().toISOString(),
      };

      // Adding the new session to the json-server
      const sessionResponse = await fetch(SESSIONS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      });
      errorMessage(`שגיאה (${sessionResponse.status})`, !sessionResponse.ok);
      
      // Storing session ID
      sessionStorage.setItem('sessionId', newSession.id);
      return { id: user.id, name: user.name };
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async logout() {
    try {
      const sessionId = sessionStorage.getItem('sessionId');
      if(sessionId) {
        // Removing session from json-server
        const response = await fetch(`${SESSIONS_URL}/${sessionId}`, { 
          method: 'DELETE' 
        });
        if(!response.ok && response.status !== 404) {
          console.error(response.status);
        }
        sessionStorage.removeItem('sessionId');
      }
      location.reload();
    } catch (error) {
      console.error('Unexpected logout error:', error);
    }
  },

  // ---
  async checkSession() {
    try {
      const sessionId = sessionStorage.getItem('sessionId');
      if(!sessionId) return false;

      // Fetching session data
      const response = await fetch(`${SESSIONS_URL}/${sessionId}`);
      errorMessage(`שגיאה (${response.status})`, !response.ok);

      const session = await response.json();
      
      // Checking if session exists and is not too old (optional, I have set it to 24 hours)
      const lastAccess = new Date(session.lastAccess);
      const now = new Date();
      const hoursSinceLastAccess = (now - lastAccess) / (1000 * 60 * 60);
      
      if(hoursSinceLastAccess > 24) { // Session expires after 24 hours
        await this.logout();
        return false;
      }

      // Updating last access in background
      fetch(`${SESSIONS_URL}/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastAccess: now.toISOString() }),
      }).catch(error => {
        console.error('Failed to update last access:', error);
      });

      // Fetching user data
      const userResponse = await fetch(`${USERS_URL}?id=${session.userId}`);
      errorMessage(`שגיאה (${userResponse.status})`, !userResponse.ok);
            
      const user = (await userResponse.json())[0];
      errorMessage('קיים סשן אך המשתמש לא נמצא', !user);
      return { id: user.id, name: user.name };
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async create(username, password) {
    try {
      // Ideally, in a real backend, I would use a secure hashing method (like bcrypt) on the server side to store passwords securely 
      
      errorMessage('יש למלא את כל השדות', !username || !password, username ? 'username' : 'password');

      // Fetching users
      const response = await fetch(USERS_URL);
      errorMessage(`שגיאה (${response.status})`, !response.ok);
    
      // Checking if user exists
      const users = await response.json();
      errorMessage('שם המשתמש תפוס', users.some(user => user.name === username), 'username');
          
      // New user object
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1, // Determining the next unique ID for a new user by finding the maximum existing ID in the users array and incrementing it by 1
        name: username,
        password, // Ideally I would hash password server-side for security
      };
    
      // Creating new user
      const createResponse = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      errorMessage(`שגיאה (${createResponse.status})`, !createResponse.ok);
      return { id: newUser.id, name: newUser.name };
    } catch (error) {
      errorHandler(error);
    }
  },

  // ---
  async getIdByUsername(username) {
    try {
      const response = await fetch(`${USERS_URL}?name=${username}`);
      errorMessage(`שגיאה (${response.status})`, !response.ok);
      const data = await response.json();
      delete data.password;
      return data && data.length > 0 ? data[0].id : null;
    } catch (error) {
      errorHandler(error);
    }
  },
};

// ---
export default User;
