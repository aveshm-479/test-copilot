# Magical Community - Wellness Club Management System

A comprehensive React-based wellness club management system with modern UI/UX design, built with TypeScript, Tailwind CSS, and Framer Motion.

## 🌟 Features

### 🎨 Enhanced UI/UX Components
- **Skeleton Loading States** - Beautiful animated loading placeholders
- **Toast Notifications** - Success/error feedback with smooth animations
- **Advanced Search** - SearchBar with suggestions and real-time filtering
- **Enhanced Forms** - Input fields with icons, validation feedback, and password toggles
- **Loading States** - Interactive buttons with loading animations
- **Empty States** - Engaging empty/error state handling with actionable guidance
- **Responsive Design** - Mobile-first approach with tablet and desktop optimizations

### 📱 Core Functionality
- **Dashboard** - Overview with metrics, charts, and activity feeds
- **Member Management** - CRUD operations for club members with advanced search
- **Admin Management** - User role management and permissions
- **Club Management** - Multi-club support with comprehensive management tools
- **Finance Tracking** - Revenue and expense management
- **Inventory Management** - Equipment and supplies tracking
- **Attendance System** - Member check-in/check-out functionality
- **Subscription Management** - Membership plans and billing

### 🔐 Authentication & Authorization
- Role-based access control (Super Admin, Admin, Member)
- Protected routes and permission-based UI
- Secure login with form validation

### 🎯 Technical Features
- **TypeScript** - Full type safety and better developer experience
- **React 18** - Latest React features with hooks and context
- **Tailwind CSS** - Utility-first styling with dark/light theme support
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form + Zod** - Type-safe form validation
- **Recharts** - Beautiful and responsive charts
- **React Router** - Client-side routing with protection

## 🚀 Live Demo

The application is deployed on GitHub Pages and accessible at:
**https://aveshm-479.github.io/test-copilot/**

### Demo Credentials
- **Super Admin:** `superadmin` / `password`
- **Admin:** `admin` / `password`  
- **Member:** `member` / `password`

## 🛠️ Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aveshm-479/test-copilot.git
   cd test-copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 📦 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment
Every push to the `main` branch automatically triggers deployment via GitHub Actions.

### Manual Deployment
```bash
npm run deploy
```

### Deployment Configuration
- **Base Path**: `/test-copilot/` (configured for GitHub Pages)
- **SPA Routing**: Includes 404.html redirect for client-side routing
- **Build Output**: `dist/` folder
- **GitHub Actions**: `.github/workflows/deploy.yml`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   └── ui/              # Enhanced UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main application component
```

## 🎨 UI Components

### Enhanced Components
- **Skeleton** - Loading state placeholders
- **Toast** - Notification system with animations
- **SearchBar** - Advanced search with suggestions
- **Input** - Enhanced form inputs with icons and validation
- **Button** - Interactive buttons with loading states
- **EmptyState** - Elegant empty/error state handling

### Form Components
- Type-safe form validation with Zod schemas
- Real-time validation feedback
- Loading states during submission
- Success/error toast notifications

## 🔧 Configuration

### Environment Variables
No environment variables required for basic functionality. All data is mocked for demonstration purposes.

### Themes
- Light/Dark mode support
- Responsive design for mobile, tablet, and desktop
- Consistent color scheme and typography

## 🚀 Performance Optimizations

- **Code Splitting** - Dynamic imports for better bundle size
- **Lazy Loading** - Components loaded on demand
- **Optimized Images** - Proper image optimization
- **Minimal Bundle** - Tree-shaking and dead code elimination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Heroicons for beautiful icons
- All contributors and the open-source community

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
