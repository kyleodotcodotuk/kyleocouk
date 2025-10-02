# CMS Documentation

## How to Use Your New CMS

Your website now includes a basic Content Management System (CMS) that allows you to login and edit your website content without touching the code.

### Accessing the CMS

1. **Login URL**: Visit `http://localhost:3000/login` (or your live domain + `/login`)
2. **Default Credentials**:
   - Username: `admin`
   - Password: `kyleo2024`

### CMS Features

#### 1. Authentication
- Secure login system with session management
- Protected admin routes that require authentication
- Logout functionality that clears your session

#### 2. Content Management
The CMS allows you to edit the following sections:

**Personal Information**
- Your name and job title
- Location
- Email address
- Bio/about section

**Expertise Content**
- Your skills and expertise description
- Professional summary

**Social Links**
- GitHub profile URL
- Bitcoin/Strike payment link
- Easy to add/remove links

#### 3. Real-time Updates
- Changes are saved to localStorage immediately
- Your live website updates instantly when you save changes
- No need to rebuild or redeploy

#### 4. User-Friendly Interface
- Clean, intuitive admin dashboard
- Form-based editing with validation
- Success/error messages for all actions
- Mobile-responsive design

### Navigation

1. **Dashboard** (`/admin`): Overview of all editable sections
2. **Personal Editor** (`/admin/personal`): Edit your bio, contact info
3. **Expertise Editor** (`/admin/expertise`): Update your skills description
4. **Social Editor** (`/admin/social`): Manage social media links

### Security Features

- Session-based authentication
- Protected routes (admin pages require login)
- Safe logout that clears all stored authentication data

### Data Storage

Currently, the CMS uses localStorage for data persistence:
- Content is saved to your browser's local storage
- Changes persist across browser sessions
- Data is automatically loaded when you visit the site

### Future Enhancements

This is a basic CMS foundation that can be extended with:

1. **Backend Integration**
   - Connect to a database for persistent storage
   - User management and roles
   - Content versioning and backups

2. **Enhanced Features**
   - Image upload and management
   - Rich text editor with formatting
   - SEO settings management
   - Analytics integration

3. **Security Improvements**
   - JWT token authentication
   - Password encryption
   - Role-based permissions
   - CSRF protection

### Customization

To change the default login credentials, edit the `login` function in:
`src/contexts/AuthContext.js`

```javascript
const login = (username, password) => {
  // Update these credentials
  if (username === 'your_username' && password === 'your_password') {
    // ... rest of the login logic
  }
};
```

### Troubleshooting

**If you can't access the admin:**
1. Clear your browser's localStorage
2. Make sure you're using the correct credentials
3. Check that you're visiting the correct URL (`/login`)

**If changes don't appear:**
1. Refresh the page
2. Check the browser console for errors
3. Ensure you clicked "Save Changes" in the admin

**For development:**
1. Run `npm start` to start the development server
2. Visit `http://localhost:3000` for the public site
3. Visit `http://localhost:3000/login` for the admin login

### Support

For technical issues or feature requests, check the console for errors and ensure all dependencies are properly installed with `npm install`.