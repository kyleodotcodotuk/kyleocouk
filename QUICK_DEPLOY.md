# 🚀 Netlify Deployment with Supabase CMS

## Database Setup Commands (Run in Supabase SQL Editor)

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

-- Create policy to allow all operations (since we're using single admin)
CREATE POLICY "Allow all operations" ON cms_content
FOR ALL USING (true);

-- Insert your default content
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

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cms_content_updated_at 
    BEFORE UPDATE ON cms_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Netlify Environment Variables

In your Netlify dashboard → Site settings → Environment variables, add:

```
REACT_APP_SUPABASE_URL = https://aojdakxzqjogmntrooqo.supabase.co
REACT_APP_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvamRha3h6cWpvZ21udHJvb3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTM0MjYsImV4cCI6MjA3NDg4OTQyNn0.zmEsgFUHCCRuhiRM5bGIQq2nH8YWV2I8Y52UcH3n2Tw
REACT_APP_ENVIRONMENT = production
```

## Quick Deployment Checklist

✅ Run SQL commands in Supabase  
✅ Add environment variables to Netlify  
✅ Push code to GitHub  
✅ Connect repository to Netlify  
✅ Deploy and test  

## Admin Login Details

Username: `admin`  
Password: `Admin2024!`  

Access your CMS at: `https://your-site.netlify.app/admin`