# Eventify

A modern, full-stack event management platform built with React, TypeScript, and Supabase. Eventify allows users to discover, create, and manage events while providing organizers with powerful tools to run successful events.

## 🚀 Features

### For Event Attendees
- **Browse Events**: Discover events by category, location, and date
- **Event Details**: Comprehensive event information with ticket purchasing
- **User Authentication**: Secure login and registration system
- **Payment Integration**: Seamless ticket purchasing with multiple payment methods
- **Ticket Management**: Digital tickets with QR codes for easy check-in

### For Event Organizers
- **Organizer Dashboard**: Complete control over your events
- **Event Creation**: Intuitive event creation with rich media support
- **Analytics**: Track attendance and revenue metrics
- **Attendee Management**: View and manage event registrations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Query** - Powerful data fetching and caching

### Backend & Database
- **Supabase** - Open-source Firebase alternative
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
  - Edge functions

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Vite** - Development server and build tool

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **bun** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/syedfahad54/eventify.git
cd eventify
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Development Server

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
eventify/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── data/              # Mock data and constants
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service integrations
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   └── types/             # TypeScript type definitions
├── supabase/              # Database migrations and config
└── ...config files
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Copy your project URL and anon key to the `.env` file
3. Run the database migrations in the `supabase/migrations/` directory

### Tailwind CSS

The project uses Tailwind CSS with custom configuration in `tailwind.config.ts`. The design system includes:

- Custom color palette
- Typography utilities
- Animation classes
- Responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Syed Fahad** - *Initial work* - [syedfahad54](https://github.com/syedfahad54)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Framer Motion](https://www.framer.com/motion/) for animations

---

Built with ❤️ using modern web technologies
