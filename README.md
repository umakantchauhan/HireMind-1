
<img width="1710" height="979" alt="Screenshot 2025-09-18 at 9 20 11 PM" src="https://github.com/user-attachments/assets/fb1264a3-2ad9-4382-9e77-1f6484f1fddf" />
<img width="1710" height="981" alt="Screenshot 2025-09-18 at 9 20 21 PM" src="https://github.com/user-attachments/assets/e11584b8-34b1-4c81-84f7-362e99826b8e" />
<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 33 03 PM" src="https://github.com/user-attachments/assets/0d8e8bce-783b-46c4-84b2-45bfca508db8" />
<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 33 14 PM" src="https://github.com/user-attachments/assets/955978f2-211b-44fe-ade7-b1b8f711ad1e" />
<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 33 32 PM" src="https://github.com/user-attachments/assets/b5a363e0-3c29-41f7-88bf-6bc22e655f7c" />
<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 33 54 PM" src="https://github.com/user-attachments/assets/dca6dd7f-b583-466d-88b6-43fd4dad0927" />

<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 33 24 PM" src="https://github.com/user-attachments/assets/7aea126d-f1f0-4772-b2aa-00bedccbf8ea" />
<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 34 00 PM" src="https://github.com/user-attachments/assets/ab12b1a9-2e0c-4e2c-9ddb-586a8ebf937a" />
<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 34 17 PM" src="https://github.com/user-attachments/assets/2f4c283a-ea0f-4fc4-8449-883731c6ab0a" />

# Hiremind - AI-Powered Interview Automation Platform<img width="1710" height="1107" alt="Screenshot 2025-09-18 at 11 34 08 PM" src="https://github.com/user-attachments/assets/2db66f67-9465-40c6-9628-8c4d56b2282b" />


An advanced AI-powered interview automation platform designed to modernize and streamline the technical hiring process.

## Features

- **Modern UI/UX**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Dark Mode Support**: Beautiful dark theme with shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Role-based Dashboards**: Separate interfaces for recruiters and candidates
- **AI-Powered Tools**: Designed for AI-assisted interview automation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hiremind-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with dark mode
│   ├── page.tsx             # Landing page
│   ├── recruiter/
│   │   └── page.tsx         # Recruiter dashboard
│   └── candidate/
│       └── page.tsx         # Candidate dashboard
├── components/
│   └── ui/
│       └── button.tsx       # shadcn/ui Button component
└── lib/
    └── utils.ts             # Utility functions
```

## Pages

### Landing Page (`/`)
- Modern hero section with company branding
- Two main action buttons: "Sign in as Recruiter" and "Sign in as Candidate"
- Feature highlights section
- Responsive design with dark mode

### Recruiter Dashboard (`/recruiter`)
- Overview of hiring metrics
- Quick actions for managing candidates
- Recent activity feed
- Navigation back to home

### Candidate Dashboard (`/candidate`)
- Application tracking
- Interview scheduling
- Progress metrics
- Recent applications and upcoming interviews

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Colors and Theme
The project uses CSS custom properties for theming. Colors can be modified in `src/app/globals.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... other color variables */
}
```

### Adding New Components
Follow the shadcn/ui pattern for new components:

1. Create component in `src/components/ui/`
2. Use the `cn()` utility for class merging
3. Export with proper TypeScript interfaces

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License


This project is licensed under the MIT License. 

