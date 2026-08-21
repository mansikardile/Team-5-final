# 🌟 Katalyst: Executive Outreach & STEM Scholarship Platform

A full-stack, enterprise-grade scholarship admission, event outreach, and student evaluation ecosystem built for **Katalyst India** to empower young women pursuing higher education in STEM (Science, Technology, Engineering, and Mathematics).

---

## 🏗️ System Architecture

```
                                  ┌──────────────────────────────┐
                                  │   Shared Supabase Database   │
                                  │    PostgreSQL + Prisma ORM   │
                                  └──────────────┬───────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   │                                                           │
        ┌──────────▼──────────┐                                     ┌──────────▼──────────┐
        │    Admin Backend    │                                     │   Student Backend   │
        │   (Express, Port    │                                     │   (Express, Port    │
        │        5000)        │                                     │        5001)        │
        └──────────┬──────────┘                                     └──────────┬──────────┘
                   │                                                           │
        ┌──────────▼──────────┐                                     ┌──────────▼──────────┐
        │   Admin Frontend    │                                     │  Student Frontend   │
        │ (Next.js 14, Port   │                                     │ (Next.js 14, Port   │
        │        3000)        │                                     │        3001)        │
        └─────────────────────┘                                     └─────────────────────┘
```

---

## 🚀 Key Modules & Capabilities

### 1. 🛡️ **Executive Admin Command Center (`http://localhost:3000`)**
* **Real-Time Funnel Analytics**: Live monitoring of candidates progressing from *Registered* &rarr; *Started* &rarr; *Completed* &rarr; *Accepted*.
* **Campus Outreach & Event Management**: Dynamic generation of college drive tracking IDs and QR codes (e.g. `KAT-2026-VISH-966`).
* **Candidate Evaluation Dossier**: Full 4-step applicant review modal featuring rendered **handwritten digital signatures**, socio-economic profiles, and SOP essays.
* **Automated Gmail SMTP Integration**: Instant dispatch of official branded HTML acceptance letters, personalized enrollment links, and interview call invitations.
* **Spreadsheet & Google Sheets Sync**: Live webhook integration and instant CSV downloads for field coordinators.

### 2. 🎓 **Student Scholar Portal (`http://localhost:3001`)**
* **Multi-Method Authentication**: Email/Password + Real Google OAuth 2.0 with instant institutional email domain verification (`.ac.in`, `.edu`).
* **4-Step Scholarship Journey**:
  1. *Academic & Contact Info* (Name, College, Year of Study, Stream).
  2. *Socio-Economic Profile* (Household Income, Earner Info, 100% Free Laptop Grant Application).
  3. *Statement of Purpose* (Why STEM Passion, 5-Year Career Vision).
  4. *Digital E-Signature & Legal Sign-off* (Interactive touch/mouse canvas with legal binding consent).
* **Live Step Validation**: Real-time completion checkmarks (`✓`) that only illuminate when required fields are populated.
* **Scannable QR Entry Pass**: Pretty-printed digital ticket card easily readable by Google Lens and mobile cameras.
* **Re-Evaluation Workflow**: Rejected applicants can update their dossier, re-sign, and re-submit for committee reconsideration.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, TanStack Query (React Query), `@react-oauth/google`, `qrcode.react`.
* **Backend**: Node.js, Express, TypeScript, Prisma ORM, Nodemailer (Gmail SMTP), Swagger UI (`/api-docs`), Zod validation, JWT, Bcrypt.
* **Database**: Supabase / PostgreSQL.

---

## 📦 Quick Start & Installation

### 1. Install Dependencies
```bash
# Admin Backend & Frontend
cd admin/backend && npm install
cd ../frontend && npm install

# Student Backend & Frontend
cd ../../student/backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in `admin/backend` and `student/backend`:
```bash
cp admin/backend/.env.example admin/backend/.env
cp student/backend/.env.example student/backend/.env
```

### 3. Launch Development Servers
```bash
# Launch all 4 services via PowerShell script:
.\start-all.ps1
```

Or run each service individually:
* **Admin Frontend**: `http://localhost:3000`
* **Admin Backend API**: `http://localhost:5000` (Swagger docs at `/api-docs`)
* **Student Frontend**: `http://localhost:3001`
* **Student Backend API**: `http://localhost:5001`

---

## 📜 License
Developed for Katalyst India Women in STEM Educational Initiative.
