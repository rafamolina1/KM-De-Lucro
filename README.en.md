# 🚚 KM de Lucro - Financial Management for Truck Drivers

[Português](README.md) | [English](README.en.md)

**KM de Lucro** is a simplified web financial management platform developed specifically for independent truck drivers. The project was created to replace complex spreadsheets and manual notes with an intuitive interface focused on performance, allowing drivers to understand the financial health of their operation in real-time.

![Home Page](/public/screenshots/homepage.png)

## ✨ Value Proposition
The application solves the "mental calculation" problem by automating profitability calculation. By entering basic freight data (origin, destination, KM, and value) and its respective costs (diesel, tolls, and extras), the system instantly delivers net profit and percentage profit margin.

![Project Dashboard](/public/screenshots/dashboard.png)

## 🛠️ Main Features
*   **Profitability Calculator**: Immediate processing of margin and profit per trip.
*   **Monthly Flow Management**: Organized history by month and year, allowing comparison of financial performance between periods.
*   **Business Intelligence for Drivers**: Identification of which routes and freight types are most profitable through detailed financial summaries.
*   **Data Export**: Generation of professional PDF and CSV reports for external control or accounting.
*   **Passwordless Access**: Authentication via Magic Link (Supabase Auth), prioritizing security and ease of access.

## 🚀 Technologies Used
*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Database & Authentication**: [Supabase](https://supabase.com/)
*   **Reporting**: [jsPDF](https://github.com/parallax/jsPDF)

## 📦 How to Run the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rafamolina1/KM-De-Lucro.git
   cd KM-De-Lucro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the project root with the following keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_SECRET=your_admin_password
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌐 Deploy
The project is configured for continuous deployment on **Vercel**. When connecting your GitHub repository, Vercel will automatically identify the settings and deploy. Don't forget to configure the environment variables in the Vercel dashboard.

---
Developed to make life easier for those on the road. 🛣️💨
