# AInSight Login System

## Overview
The AInSight platform now includes a beautiful cosmic-themed login page for users and developers to access the dashboard.

## Features

### 🌌 Cosmic Design
- **Pitch-black space background** with 600 twinkling stars
- **Glassmorphism login card** with purple glow effects
- **Smooth animations** and hover effects
- **Responsive design** for mobile and desktop

### 🔐 Authentication
- **Email or Username login** - accepts both formats
- **Remember Me** checkbox for persistent sessions
- **Password reset** link (frontend ready, backend needs implementation)
- **JWT token-based** authentication
- **Session storage** for "Remember Me" feature

## Pages

### Login Page (`login.html`)
- Located at: `/frontend/login.html`
- Features:
  - Email/Username input
  - Password input
  - Remember Me checkbox
  - Forgot Password link
  - Request Access link
  - Back to Home button

### Navigation Updates
All main pages now include a "Login" link:
- `index-cosmic.html` - Main landing page
- `index-mission-control.html` - Alternative landing page
- `ai-chat.html` - AI Assistant page

## Backend Integration

### API Endpoint
```
POST http://localhost:5000/api/auth/login
```

### Request Format
```json
{
  "email": "user@example.com",  // or "username": "username"
  "password": "userpassword"
}
```

### Response Format (Success)
```json
{
  "message": "Login successful",
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "full_name": "User Name",
    "role": "admin",
    "status": "active",
    "permissions": { ... }
  }
}
```

### Response Format (Error)
```json
{
  "error": "Invalid email or password"
}
```

## Authentication Flow

1. **User visits login page** (`/frontend/login.html`)
2. **Enters credentials** (email/username and password)
3. **Frontend sends POST request** to backend API
4. **Backend validates credentials** and returns JWT token
5. **Frontend stores token**:
   - `localStorage` if "Remember Me" is checked
   - `sessionStorage` otherwise
6. **Frontend redirects to dashboard** (`/frontend/dashboard.html`)

## Protected Routes

The following pages require authentication:
- `/frontend/dashboard.html` - Admin dashboard
- Other admin pages (analytics, users, etc.)

If a user tries to access these without being logged in, they will be redirected to `/frontend/login.html`.

## Token Storage

### LocalStorage (Persistent)
When "Remember Me" is checked:
```javascript
localStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));
```

### SessionStorage (Temporary)
When "Remember Me" is not checked:
```javascript
sessionStorage.setItem('token', access_token);
localStorage.setItem('user', JSON.stringify(user));
```

## Logout Flow

1. **User clicks logout button** in dashboard
2. **Frontend clears all stored data**:
   ```javascript
   localStorage.removeItem('token');
   sessionStorage.removeItem('token');
   localStorage.removeItem('user');
   ```
3. **Frontend redirects to login page**

## Testing Credentials

To test the login system, you need to:

1. **Start the backend server**:
   ```bash
   cd backend
   python run.py
   ```

2. **Create a test user** (using Python shell or API):
   ```python
   from app import create_app, db
   from app.models import User
   
   app = create_app()
   with app.app_context():
       user = User(
           email='admin@ainsight.com',
           username='admin',
           full_name='Admin User',
           role='admin',
           status='active'
       )
       user.set_password('admin123')
       db.session.add(user)
       db.session.commit()
   ```

3. **Login with**:
   - Email: `admin@ainsight.com` OR Username: `admin`
   - Password: `admin123`

## Security Features

### Implemented
- ✅ JWT token-based authentication
- ✅ Password hashing (backend)
- ✅ HTTPS ready (when deployed)
- ✅ Token expiration (configurable in backend)
- ✅ Secure session management

### Recommended for Production
- 🔒 Enable CORS properly
- 🔒 Use HTTPS only
- 🔒 Implement rate limiting
- 🔒 Add CSRF protection
- 🔒 Enable password complexity requirements
- 🔒 Add 2FA support
- 🔒 Implement password reset via email

## File Structure

```
frontend/
├── login.html              # Login page
├── dashboard.html          # Protected dashboard (requires auth)
├── index-cosmic.html       # Public landing page (with login link)
├── index-mission-control.html  # Alternative landing (with login link)
├── ai-chat.html           # AI chat page (with login link)
├── js/
│   ├── auth.js            # Authentication utilities
│   ├── api.js             # API helper functions
│   └── ...
└── css/
    └── ...
```

## Customization

### Change Login Redirect
To change where users go after login, edit `login.html`:
```javascript
// Change this line:
window.location.href = 'dashboard.html';

// To:
window.location.href = 'your-page.html';
```

### Change Logout Redirect
To change where users go after logout, edit `js/auth.js`:
```javascript
function logout() {
    removeToken();
    window.location.href = 'login.html';  // Change this
}
```

### Customize Login Form
Edit `login.html` to:
- Add more fields
- Change validation
- Modify styling
- Add social login buttons

## Troubleshooting

### "Unable to connect to server"
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in backend
- Verify API endpoint is accessible

### "Invalid email or password"
- Check credentials
- Ensure user exists in database
- Verify user status is 'active'

### Token Issues
- Clear browser localStorage/sessionStorage
- Check token expiration settings
- Verify JWT secret key is configured

## Next Steps

1. **Implement Password Reset**:
   - Add email service configuration
   - Create reset token system
   - Build reset password page

2. **Add Social Login**:
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth

3. **Enhance Security**:
   - Add reCAPTCHA
   - Implement 2FA
   - Add session management

4. **User Management**:
   - Admin panel for user creation
   - Role-based access control
   - Permission management UI

## Support

For issues or questions:
- Check backend logs: `backend/logs/`
- Check browser console for frontend errors
- Verify API endpoint responses in Network tab
