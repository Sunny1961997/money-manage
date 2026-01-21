---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
---

<!-- _class: lead -->
# **AML Management Solutions**
## Compliance & Risk Management Platform

**Next.js 16 + Laravel Backend**

Presented by: Your Name
Date: January 2025

---

# **Project Overview**

## 🎯 Purpose
A comprehensive **Anti-Money Laundering (AML)** compliance platform designed for financial institutions in the UAE to:
- Screen customers against sanctions lists
- Manage customer onboarding (KYC)
- Generate GOAML compliance reports
- Monitor risk levels and transactions

**Tech Stack:**
- Frontend: Next.js 16, TypeScript, Tailwind CSS
- Backend: Laravel 8000 API
- State Management: Zustand
- UI Components: Shadcn/ui

---

# **Key Features - Dashboard**

## 📊 Multi-Role Access System
- **Admin Dashboard** - System & company management
- **Company Admin** - Full feature access
- **MLRO** - Compliance officer role
- **Analyst** - Read-only access

## ✅ Features Implemented:
- Role-based navigation
- Account statistics with real-time data
- Company user management
- Session-based authentication

---

# **Feature 1: Customer Management**

## 👥 Onboarded Customers Page

**Capabilities:**
- View all onboarded customers (Individual & Corporate)
- Expandable detailed view
- **Download customer details as PDF** ✨
- Edit customer information
- Filter by customer type

**PDF Generator Features:**
- Professional layout with color coding
- Sections: Personal/Company Info, License, Risk Assessment
- Partners/UBOs table for corporate clients
- Document tracking
- Auto-pagination

---

# **Feature 2: Customer Onboarding**

## 🔐 Two Onboarding Types

### 1️⃣ **Full Customer Onboarding**
- Individual & Corporate forms
- Complete KYC data collection
- Risk assessment
- Document upload
- Country operations
- Partner/UBO management

### 2️⃣ **Quick Onboarding**
- Single/Batch entry options
- Simplified ID verification
- Faster processing for low-risk clients

---

# **Feature 3: Sanctions Screening**

## 🔍 Advanced Screening Engine

**Quick Screening:**
- Individual, Entity, and Vessel screening
- Searchable country dropdowns (Combobox)
- Adjustable confidence slider (10-90%)
- Date of Birth filtering
- Gender & Nationality filters

**Results Management:**
- Download screening results as PDF
- Color-coded confidence bands (High/Fair/Low)
- Decision tracking (Relevant/Irrelevant/False Positive)
- Annotations for compliance records

---

# **Feature 4: GOAML Reporting**

## 📋 Compliance Reporting System

**Features:**
- Create/Edit GOAML reports
- Customer selection with search
- Transaction type tracking
- Item description & valuation
- XML file generation
- Status comments & annotations

**Workflow:**
1. Select customer
2. Fill transaction details
3. Add item information
4. Generate XML for regulatory submission
5. Download for GOAML portal upload

---

# **Feature 5: Account Statistics**

## 📈 Real-time Analytics Dashboard

**Live Statistics:**
- Total onboarded users (Individual vs Corporate)
- Ongoing monitoring count
- High-risk user tracking
- Risk level distribution chart
- Onboarding status breakdown

**Visual Elements:**
- Bar charts for onboarding status
- Progress bars for risk levels
- Color-coded status indicators
- Percentage calculations

**API Integration:** `GET /api/users/account-stats`

---

# **Feature 6: Admin Portal**

## ⚙️ System Administration

**Company Management:**
- Add new companies
- Track screenings quota
- License management
- Expiration monitoring

**User Management:**
- Create company users
- Assign roles (Company Admin, MLRO, Analyst)
- Link users to companies
- Role-based permissions

**API Endpoints:**
- `POST /api/companies`
- `POST /api/users`
- `GET /api/company-users`

---

# **Feature 7: User Profile & Settings**

## 👤 Profile Management

**Profile Information:**
- Personal details
- Company affiliation
- Passport information
- Contact details
- Address information

**Security:**
- **Change Password** feature ✨
  - Current password verification
  - New password validation (min 8 chars)
  - Password confirmation
  - Show/hide toggle for all fields
  - Success toast notification

**API:** `PUT /api/users/change-password`

---

# **Feature 8: Screening Logs**

## 📝 Audit Trail System

**Tracking:**
- All screening activities
- User attribution
- Search strings
- Screening types
- Match results (True/False)
- Timestamps

**Benefits:**
- Compliance audit trail
- User activity monitoring
- Search analytics
- Historical data

**API:** `GET /api/screening-logs`

---

# **Technical Highlights**

## 🛠️ Advanced Implementation

**PDF Generation:**
- `jsPDF` + `jsPDF-autoTable`
- Professional templates
- Auto-pagination
- Multi-section layouts
- Color-coded information

**State Management:**
- Zustand store for auth
- Session token in cookies
- Role-based UI rendering

**API Proxy Pattern:**
- Next.js API routes proxy to Laravel
- Token validation
- Error handling
- Type-safe responses

---

# **UI/UX Features**

## 🎨 User Experience

**Components:**
- Responsive design (mobile-first)
- Dark mode support (theme provider)
- Toast notifications
- Loading states & spinners
- Form validation with error messages
- Searchable dropdowns (Combobox)
- Expandable table rows
- Modal dialogs

**Accessibility:**
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

---

# **Security Implementation**

## 🔒 Authentication & Authorization

**Security Measures:**
- Session token authentication
- HTTP-only cookies
- Role-based access control (RBAC)
- Protected API routes
- Server-side validation
- CSRF protection

**User Flow:**
1. Login → Token stored in cookie
2. Every request includes token
3. Laravel validates token
4. Role-based UI rendering
5. Logout → Cookie cleared

---

# **API Integration**

## 🔌 Laravel Backend Integration

**Implemented Endpoints:**
- `POST /api/login` - Authentication
- `POST /api/logout` - Session termination
- `GET /api/users/account-stats` - Dashboard data
- `GET /api/onboarding/customers` - Customer list
- `GET /api/onboarding/customers/:id` - Customer details
- `POST /api/onboarding/customers` - Create customer
- `PUT /api/users/change-password` - Update password
- `GET /api/sanction-entities` - Screening
- `POST /api/goaml/reports` - GOAML creation
- `GET /api/screening-logs` - Audit logs

---

# **File Structure**

## 📁 Project Organization

```
sanction/
├── app/
│   ├── dashboard/          # Main dashboard
│   │   ├── admin/          # Admin portal
│   │   ├── customers/      # Customer management
│   │   ├── onboarding/     # KYC forms
│   │   ├── screening/      # Sanctions screening
│   │   ├── goaml-reporting/# GOAML reports
│   │   └── account-stats/  # Analytics
│   └── api/                # API proxy routes
├── components/
│   ├── ui/                 # Shadcn components
│   ├── header.tsx          # App header
│   └── sidebar.tsx         # Navigation
└── lib/
    ├── pdf-generator.ts    # Customer PDF
    ├── screening-pdf-generator.ts
    └── store.ts            # Zustand auth store
```

---

# **Challenges & Solutions**

## 💡 Problem Solving

**Challenge 1: PDF Generation**
- **Problem:** Complex customer data structure
- **Solution:** Modular PDF generator with sections, auto-pagination

**Challenge 2: Role-Based Navigation**
- **Problem:** Different UI for different roles
- **Solution:** Dynamic sidebar based on user role from Zustand store

**Challenge 3: Multi-step Forms**
- **Problem:** Large onboarding forms
- **Solution:** Tab-based UI with validation per section

**Challenge 4: Searchable Dropdowns**
- **Problem:** 200+ countries to select
- **Solution:** Custom Combobox component with search

---

# **Future Enhancements**

## 🚀 Roadmap

**Planned Features:**
1. **Batch Screening** - Excel upload for bulk screening
2. **Adverse Media Search** - News & media monitoring
3. **Risk Calculator** - Automated risk scoring
4. **Email Notifications** - Alerts for high-risk matches
5. **Advanced Reporting** - Custom report builder
6. **Multi-language Support** - Arabic & English
7. **Mobile App** - React Native version
8. **AI-Powered Screening** - ML for better matching

---

# **Key Metrics**

## 📊 Project Statistics

**Development:**
- **Total Pages:** 20+ unique pages
- **API Routes:** 15+ proxy endpoints
- **UI Components:** 50+ Shadcn components
- **Features:** 8 major modules
- **User Roles:** 4 different roles
- **PDF Generators:** 2 (Customer & Screening)

**Code Quality:**
- TypeScript for type safety
- Component-based architecture
- Reusable utility functions
- Consistent styling with Tailwind

---

# **Technologies Used**

## 🔧 Tech Stack Summary

**Frontend:**
- Next.js 16 (React 19)
- TypeScript 5
- Tailwind CSS 4
- Shadcn/ui Components
- Zustand (State Management)
- jsPDF (PDF Generation)

**Backend:**
- Laravel (Port 8000)
- RESTful API
- Session Authentication

**Tools:**
- Git for version control
- VS Code
- Postman (API testing)

---

# **Demo Highlights**

## 🎬 Key Workflows

**1. Customer Onboarding Flow:**
Login → Dashboard → Onboarding → Fill Form → Submit → View in Customers

**2. Screening Workflow:**
Login → Screening → Enter Details → Adjust Confidence → Search → Review Results → Download PDF

**3. GOAML Reporting:**
Login → GOAML → Create Report → Select Customer → Fill Details → Generate XML

**4. Admin Workflow:**
Login as Admin → Companies → Add Company → Company Users → Create User → Assign Role

---

# **Best Practices Implemented**

## ✅ Code Quality

**Architecture:**
- Separation of concerns
- DRY principles
- Component reusability
- Type safety with TypeScript

**Security:**
- No hardcoded credentials
- Environment variables
- Secure cookie handling
- Input validation

**Performance:**
- Lazy loading
- Code splitting
- Optimized images
- Efficient state updates

---

<!-- _class: lead -->
# **Thank You!**

## Questions?

**Project Repository:** [Your GitHub Link]
**Contact:** [Your Email]
**Demo:** [Live Demo URL if available]

---

**Technologies:** Next.js | TypeScript | Laravel | Tailwind CSS
**Industry:** Financial Compliance | AML/CFT
**Region:** UAE Regulatory Compliance
