# Logistics Enterprise Portal

A modern web portal for embedding Power BI reports and Microsoft Copilot Studio chatbots with role-based access control.

## Features

- 🔐 **Role-based Authentication** - Admin and User roles with different permissions
- 📊 **Power BI Integration** - Embed Power BI reports with secure token generation
- 🤖 **Copilot Studio Integration** - Embed Microsoft Copilot Studio chatbots
- ⚙️ **Admin Panel** - Manage menu items, add/edit/delete integrations
- 🎨 **Modern UI** - Beautiful, responsive design with dark theme
- 💾 **Persistent Storage** - Menu configurations saved in Upstash Redis (shared across all users)

## Demo Credentials

| Role  | Email            | Password  |
|-------|------------------|-----------|
| Admin | admin@admin.com  | Admin123  |
| User  | user@user.com    | User123   |

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Upstash Redis (Required for Persistent Storage)

The application uses Upstash Redis for persistent storage so that all users can see the same menu items and Power BI credentials.

**Free Tier Available:** Upstash offers a free tier with 10,000 commands/day and 256 MB storage.

#### Setup Steps:

1. **Create an Upstash account:**
   - Go to [https://console.upstash.com/](https://console.upstash.com/)
   - Sign up for a free account

2. **Create a Redis database:**
   - Click "Create Database"
   - Choose a name and region (closest to your users)
   - Select the "Free" tier
   - Click "Create"

3. **Get your credentials:**
   - After creating the database, go to the "Details" tab
   - Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

4. **Set environment variables:**

   **For local development:**
   - Create a `.env.local` file in the project root
   - Add your credentials:
   ```env
   UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
   ```

   **For Vercel deployment:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   - Redeploy your application

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

**Note:** If Redis is not configured, the app will still work but will use default items and won't persist changes across users.

## Deployment to Vercel

### Option 1: GitHub + Vercel (Recommended)

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Import Project" and select your repository
4. Vercel will auto-detect Next.js and configure the build
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Configuration

### Adding a Copilot Studio Chatbot

1. Log in as admin (admin@admin.com / Admin123)
2. Click "Manage Items" in the sidebar
3. Click "Add New Item"
4. Select "Copilot Studio" type
5. Enter the embed URL from Copilot Studio → Channels → Custom website
6. Save

### Adding a Power BI Report

1. Log in as admin
2. Click "Manage Items"
3. Click "Add New Item"
4. Select "Power BI" type
5. Enter the required configuration:
   - **Client ID**: Azure AD App Registration client ID
   - **Client Secret**: Azure AD App Registration client secret
   - **Tenant ID**: Your Azure AD tenant ID
   - **Workspace ID**: Power BI workspace/group ID
   - **Report ID**: Power BI report ID
6. Save

### Power BI Setup Requirements

For Power BI embedding to work, you need:

1. **Azure AD App Registration**
   - Register an app in Azure AD
   - Add API permissions for Power BI Service
   - Create a client secret

2. **Power BI Service**
   - Service Principal must be added to the workspace
   - Report must be in a workspace (not "My Workspace")

3. **Capacity**
   - Power BI Premium, Premium Per User, or Embedded capacity required for app-owns-data embedding

## Project Structure

```
portal-app/
├── app/
│   ├── api/
│   │   ├── menu-items/
│   │   │   └── route.ts          # Menu items API (GET/POST)
│   │   └── powerbi/
│   │       └── embed/
│   │           └── route.ts      # Power BI token generation API
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Login page
│   └── page.module.css           # Login styles
├── components/
│   ├── Dashboard.tsx             # Main dashboard layout
│   ├── Dashboard.module.css
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Sidebar.module.css
│   ├── ContentViewer.tsx         # Content display (Power BI/Copilot)
│   ├── ContentViewer.module.css
│   ├── AdminPanel.tsx            # Admin management panel
│   └── AdminPanel.module.css
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── auth.ts                   # Authentication utilities
│   ├── storage.ts               # API-based storage management
│   └── redis.ts                  # Upstash Redis client
├── styles/
│   └── globals.css               # Global styles and CSS variables
├── package.json
├── tsconfig.json
└── next.config.js
```

## Customization

### Changing the Color Theme

Edit `/styles/globals.css` and modify the CSS variables:

```css
:root {
  --color-accent-primary: #ff6b4a;    /* Main accent color */
  --color-bg-primary: #0a0e1a;        /* Background color */
  /* ... */
}
```

### Adding New Icon Options

Edit `/components/AdminPanel.tsx` and add icons to the `AVAILABLE_ICONS` array:

```typescript
const AVAILABLE_ICONS = [
  'MessageSquare',
  'Bot',
  'BarChart3',
  // Add more icon names here
];
```

### Modifying Authentication

Edit `/lib/auth.ts` to change user credentials or implement a proper authentication system:

```typescript
const USERS = {
  'admin@admin.com': {
    password: 'Admin123',
    user: { email: 'admin@admin.com', role: 'admin', name: 'Administrator' },
  },
  // Add more users
};
```

## Environment Variables

### Required for Persistent Storage

```env
# .env.local
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
```

### Optional (for Power BI)

```env
# .env.local
POWERBI_CLIENT_ID=your-client-id
POWERBI_CLIENT_SECRET=your-client-secret
POWERBI_TENANT_ID=your-tenant-id
```

**For Vercel:** Add these in Project Settings → Environment Variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this for your projects!

## Support

For issues or questions, please open an issue on GitHub.
