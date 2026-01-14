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

## Deployment to Azure Web App (App Service)

This guide provides **detailed step-by-step instructions** for deploying this Next.js application to Azure App Service. You can use either the **Azure Portal (GUI)** or **Azure CLI (command line)**.

---

### Prerequisites

Before you begin, ensure you have:

1. **An Azure Account** - [Create a free account](https://azure.microsoft.com/free/) if you don't have one
2. **Azure CLI** (for CLI method) - [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
3. **Node.js 18+** installed locally for building
4. **Git** installed (optional, for GitHub deployment)
5. **Upstash Redis credentials** (see [Set Up Upstash Redis](#2-set-up-upstash-redis-required-for-persistent-storage) section above)

---

### Option A: Deploy via Azure Portal (GUI)

#### Step 1: Create a Resource Group

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** (+ icon in top left)
3. Search for **"Resource group"** and click **Create**
4. Fill in the details:
   - **Subscription**: Select your Azure subscription
   - **Resource group**: Enter a name (e.g., `copilot-bi-portal-rg`)
   - **Region**: Choose a region close to your users (e.g., `East US`, `West Europe`)
5. Click **"Review + create"** → **"Create"**

#### Step 2: Create an App Service Plan

1. Click **"Create a resource"**
2. Search for **"App Service Plan"** and click **Create**
3. Fill in the details:
   - **Subscription**: Select your subscription
   - **Resource Group**: Select the resource group you just created
   - **Name**: Enter a name (e.g., `copilot-bi-portal-plan`)
   - **Operating System**: Select **Linux** (recommended for Next.js)
   - **Region**: Same region as your resource group
   - **Pricing Tier**: Click **"Change size"** and select:
     - **Dev/Test** → **B1** (Basic) for testing ($13/month)
     - **Production** → **P1V2** or higher for production workloads
4. Click **"Review + create"** → **"Create"**

#### Step 3: Create the Web App

1. Click **"Create a resource"**
2. Search for **"Web App"** and click **Create**
3. Fill in the **Basics** tab:
   - **Subscription**: Select your subscription
   - **Resource Group**: Select your resource group
   - **Name**: Enter a globally unique name (e.g., `copilot-bi-portal-yourcompany`)
     - This becomes your URL: `https://copilot-bi-portal-yourcompany.azurewebsites.net`
   - **Publish**: Select **Code**
   - **Runtime stack**: Select **Node 22 LTS**
   - **Operating System**: **Linux**
   - **Region**: Same as your resource group
   - **App Service Plan**: Select the plan you created
4. Click **"Next: Deployment"**
5. On the **Deployment** tab:
   - **Enable GitHub Actions**: Toggle **ON** if you want CI/CD from GitHub
   - If enabled:
     - **GitHub account**: Authorize and select your account
     - **Organization**: Select your organization or personal account
     - **Repository**: Select `copilot-bi-app`
     - **Branch**: Select `main`
6. Click **"Review + create"** → **"Create"**
7. Wait for deployment to complete (1-2 minutes)

#### Step 4: Configure Application Settings (Environment Variables)

1. Go to your newly created Web App in Azure Portal
2. In the left sidebar, under **Settings**, click **"Environment variables"**
3. Click **"+ Add"** for each of the following variables:

   | Name | Value | Required |
   |------|-------|----------|
   | `UPSTASH_REDIS_REST_URL` | `https://your-redis.upstash.io` | ✅ Yes |
   | `UPSTASH_REDIS_REST_TOKEN` | `your-upstash-token` | ✅ Yes |
   | `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` | ✅ Yes |
   | `WEBSITE_NODE_DEFAULT_VERSION` | `~22` | ✅ Yes |
   | `POWERBI_CLIENT_ID` | `your-azure-ad-client-id` | ❌ Optional |
   | `POWERBI_CLIENT_SECRET` | `your-azure-ad-secret` | ❌ Optional |
   | `POWERBI_TENANT_ID` | `your-azure-tenant-id` | ❌ Optional |

4. Click **"Apply"** at the bottom
5. Click **"Confirm"** when prompted to restart the app

#### Step 5: Configure Startup Command (Important!)

1. In the left sidebar, under **Settings**, click **"Configuration"**
2. Click the **"General settings"** tab
3. Find **"Startup Command"** and enter:
   ```
   npm run start
   ```
4. Click **"Save"** at the top

#### Step 6: Deploy Your Code (if not using GitHub Actions)

**Option 6a: Deploy via ZIP Upload**

1. On your local machine, open a terminal in the project folder
2. Build the project:
   ```bash
   npm install
   npm run build
   ```
3. Create a ZIP file containing **all project files** (including `node_modules`, `.next`, etc.)
4. In Azure Portal, go to your Web App
5. In the left sidebar, under **Deployment**, click **"Advanced Tools"** → **"Go"**
6. This opens **Kudu**. Click **"Tools"** → **"Zip Push Deploy"**
7. Drag and drop your ZIP file

**Option 6b: Deploy via Deployment Center**

1. In Azure Portal, go to your Web App
2. In the left sidebar, click **"Deployment Center"**
3. Choose your source:
   - **GitHub**: Connect to your repository for automatic deployments
   - **Local Git**: Get a Git URL to push directly
   - **External Git**: Use any Git repository URL
4. Follow the prompts to complete setup

#### Step 7: Verify Deployment

1. In Azure Portal, go to your Web App
2. Click **"Browse"** at the top (or click the URL in the Overview)
3. Your app should load at `https://your-app-name.azurewebsites.net`
4. Test login with: `admin@admin.com` / `Admin123`

---

### Option B: Deploy via Azure CLI (Command Line)

#### Step 1: Login to Azure

```bash
# Login to Azure (opens browser for authentication)
az login

# Verify you're logged in and see your subscriptions
az account list --output table

# Set the subscription you want to use (if you have multiple)
az account set --subscription "Your Subscription Name"
```

#### Step 2: Create Resource Group

```bash
# Create a resource group
# Replace 'eastus' with your preferred region
az group create \
  --name copilot-bi-portal-rg \
  --location eastus
```

**Available regions:** `eastus`, `eastus2`, `westus`, `westus2`, `westeurope`, `northeurope`, `southeastasia`, `australiaeast`, etc.

#### Step 3: Create App Service Plan

```bash
# Create a Linux App Service Plan
az appservice plan create \
  --name copilot-bi-portal-plan \
  --resource-group copilot-bi-portal-rg \
  --sku B1 \
  --is-linux
```

**SKU Options:**
| SKU | Type | vCPU | RAM | Price (approx) |
|-----|------|------|-----|----------------|
| `F1` | Free | Shared | 1 GB | Free (60 min/day limit) |
| `B1` | Basic | 1 | 1.75 GB | ~$13/month |
| `B2` | Basic | 2 | 3.5 GB | ~$26/month |
| `P1V2` | Premium | 1 | 3.5 GB | ~$81/month |
| `P2V2` | Premium | 2 | 7 GB | ~$162/month |

#### Step 4: Create the Web App

```bash
# Create the Web App with Node.js 22 LTS runtime
az webapp create \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --plan copilot-bi-portal-plan \
  --runtime "NODE|22-lts"
```

> **Note:** The `--name` must be globally unique across all Azure. If taken, try adding your company name or random numbers.

#### Step 5: Configure Application Settings

```bash
# Set all environment variables at once
az webapp config appsettings set \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --settings \
    UPSTASH_REDIS_REST_URL="https://your-redis-instance.upstash.io" \
    UPSTASH_REDIS_REST_TOKEN="your-redis-token-here" \
    SCM_DO_BUILD_DURING_DEPLOYMENT="true" \
    WEBSITE_NODE_DEFAULT_VERSION="~22"
```

**Optional Power BI settings** (add if using Power BI embedding):

```bash
az webapp config appsettings set \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --settings \
    POWERBI_CLIENT_ID="your-azure-ad-client-id" \
    POWERBI_CLIENT_SECRET="your-azure-ad-client-secret" \
    POWERBI_TENANT_ID="your-azure-tenant-id"
```

#### Step 6: Enable Build During Deployment

```bash
# Configure the build process
az webapp config set \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --startup-file "npm run start"
```

#### Step 7: Deploy the Application

**Method A: Quick Deploy with `az webapp up` (Recommended)**

```bash
# Navigate to your project directory
cd /path/to/webpage-bi-copilot-azure

# Deploy directly (Azure will build and deploy)
az webapp up \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --runtime "NODE|22-lts"
```

**Method B: Build Locally + ZIP Deploy**

```bash
# 1. Install dependencies
npm install

# 2. Build the Next.js app
npm run build

# 3. Create deployment package (PowerShell)
Compress-Archive -Path * -DestinationPath deploy.zip -Force

# 3. Alternative: Create deployment package (Bash/Linux/Mac)
zip -r deploy.zip . -x "*.git*"

# 4. Deploy the ZIP file
az webapp deploy \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --src-path deploy.zip \
  --type zip
```

**Method C: GitHub Actions (CI/CD)**

```bash
# Configure deployment from GitHub
az webapp deployment source config \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --repo-url https://github.com/LogisticsE/copilot-bi-app \
  --branch main \
  --git-token YOUR_GITHUB_PAT
```

#### Step 8: Verify Deployment

```bash
# Open the web app in your default browser
az webapp browse \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg

# Check the app URL
az webapp show \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --query defaultHostName \
  --output tsv
```

---

### Monitoring & Troubleshooting

#### View Application Logs

```bash
# Enable application logging
az webapp log config \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --application-logging filesystem \
  --level verbose

# Stream logs in real-time
az webapp log tail \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg
```

#### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **502 Bad Gateway** | App didn't start correctly | Check logs with `az webapp log tail`; verify startup command is `npm run start` |
| **Application Error** | Missing environment variables | Verify all required env vars are set in Configuration |
| **Build Failed** | Node version mismatch | Ensure `WEBSITE_NODE_DEFAULT_VERSION="~22"` is set |
| **Redis Connection Failed** | Wrong Upstash credentials | Double-check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` |
| **Slow Cold Start** | Basic tier limitations | Upgrade to Premium tier or enable "Always On" |
| **Port Binding Error** | Hardcoded port | Next.js automatically uses `process.env.PORT` which Azure provides |

#### Enable "Always On" (Prevents Cold Starts)

```bash
az webapp config set \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg \
  --always-on true
```

> **Note:** "Always On" requires Basic (B1) tier or higher.

#### Restart the App

```bash
az webapp restart \
  --name copilot-bi-portal-yourcompany \
  --resource-group copilot-bi-portal-rg
```

---

### Cost Estimation

| Component | Tier | Monthly Cost (approx) |
|-----------|------|----------------------|
| App Service Plan | B1 (Basic) | ~$13 |
| App Service Plan | P1V2 (Production) | ~$81 |
| Upstash Redis | Free tier | $0 |
| Upstash Redis | Pay-as-you-go | ~$0.20 per 100K commands |

**Total for Dev/Test:** ~$13/month  
**Total for Production:** ~$81/month

---

### Clean Up Resources (Delete Everything)

If you want to delete all resources and stop charges:

```bash
# Delete the entire resource group (deletes all resources inside)
az group delete \
  --name copilot-bi-portal-rg \
  --yes \
  --no-wait
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
