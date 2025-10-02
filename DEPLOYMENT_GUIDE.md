# 🚀 Database Integration & Deployment Guide

## Overview

Your CMS now supports both **localStorage** (for development) and **Supabase** (for production). This allows you to:

- ✅ Continue developing locally with localStorage
- ✅ Deploy to production with a real database
- ✅ Have data persistence across users and devices
- ✅ Secure authentication and data storage

---

## 🗄️ Database Setup (Supabase - Recommended)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the database to be provisioned

### Step 2: Create Database Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create the cms_content table
CREATE TABLE cms_content (
  id BIGINT PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to manage content
CREATE POLICY "Allow authenticated users to manage content" ON cms_content
FOR ALL USING (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO cms_content (id, content) VALUES (
  1,
  '{
    "personal": {
      "name": "Kyle O''Connor",
      "title": "UI Developer", 
      "location": "Manchester · United Kingdom",
      "email": "info@kyleo.co.uk",
      "bio": "Hello, I am Kyle O''Connor!\\nCurrently a UI developer, AKA a front end developer, web designer or other similar terminology.\\n\\nI live in Tameside, more well known as a part of Greater Manchester. With a remote based job for a company in Surrey.\\n\\nInterested in any services, I''ll see what I can do for you, email me."
    },
    "expertise": {
      "description": "I make sure a website or interface looks good, feels smooth, and is intuitive for all users.\\n\\nMy job is basically to turn a designer''s vision into reality using code. However, due to factors like accessibility guidelines and common sense, I occasionally overrule the designer.\\n\\nHaving been doing it for almost a decade, I can confidently say I am an expert at front end."
    },
    "social": {
      "github": "https://github.com/kyleodotcodotuk",
      "bitcoin": "https://strike.me/kyleocouk/"
    }
  }'::jsonb
);
```

### Step 3: Set Up Authentication (Optional)

If you want secure authentication instead of hardcoded credentials:

```sql
-- Create admin user (run this after setting up authentication)
-- You'll need to sign up through Supabase Auth first
```

### Step 4: Get Your Credentials

From your Supabase project settings:
1. Go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

---

## 🔧 Local Development Setup

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Update Supabase Client

Edit `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🌐 Netlify Deployment

### Step 1: Prepare for Build

1. Make sure your code is committed to Git
2. Push to GitHub/GitLab/Bitbucket

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

### Step 3: Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add your Supabase credentials:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Your CMS will be live!

---

## 🔐 Authentication Options

### Current Setup (Basic)
- Hardcoded admin credentials
- Works with both localStorage and Supabase
- Good for single-user CMS

### Recommended for Production
- Supabase Auth with email/password
- JWT token-based sessions
- Password reset functionality
- Multiple admin users

---

## 🛠️ Current Features

### ✅ Working Now
- **Dual Storage**: localStorage for dev, Supabase for production
- **Automatic Fallback**: If database fails, falls back to localStorage
- **Same Interface**: No code changes needed when switching
- **Ready for Deployment**: All Netlify configuration included

### 🚀 Future Enhancements
- **Image Uploads**: Profile pictures and content images
- **Multi-user Support**: Different permission levels
- **Content Versioning**: Track changes and rollback
- **API Keys**: Secure API access for external integrations

---

## 📝 Deployment Checklist

- [ ] Create Supabase account and project
- [ ] Run database setup SQL
- [ ] Install @supabase/supabase-js: `npm install @supabase/supabase-js`
- [ ] Update `src/lib/supabase.js` with your credentials
- [ ] Test locally with `npm start`
- [ ] Push code to Git repository
- [ ] Connect repository to Netlify
- [ ] Add environment variables in Netlify
- [ ] Deploy and test production site
- [ ] Update admin password for security

---

## 🆘 Troubleshooting

### "Module not found: @supabase/supabase-js"
Run: `npm install @supabase/supabase-js`

### Database connection errors
- Check your environment variables
- Verify Supabase URL and key
- Check Supabase project is active

### Netlify build failures
- Ensure all dependencies are in package.json
- Check environment variables are set
- Review build logs for specific errors

### Authentication not working
- Verify database policies are set correctly
- Check if RLS (Row Level Security) is configured
- Ensure user exists in Supabase Auth

---

## 💡 Tips for Success

1. **Start Simple**: Deploy with localStorage first, then add database
2. **Test Locally**: Always test database connection locally before deploying
3. **Backup Data**: Export your localStorage data before switching to database
4. **Monitor Performance**: Check Supabase dashboard for usage and performance
5. **Security**: Change default passwords and use environment variables

Your CMS is now production-ready! 🎉