# SafeKey - Secure Password Manager

A modern, cross-platform password manager entirely design for elderly people (but can be used by all ages) built with React, TypeScript, and Capacitor. SafeKey provides secure password storage with biometric authentication, multi-factor authentication, and advanced security features.

## Features

### 🔐 Security
- **End-to-End Encryption**: All passwords are encrypted using advanced encryption algorithms
- **Biometric Authentication**: Fingerprint and face recognition support via Corbado
- **Multi-Factor Authentication**: SMS-based OTP verification via Twilio (used if password was forgotten)
- **PIN Authentication**: Quick access with secure PIN codes
- **Auto-Lock**: Configurable automatic locking for enhanced security
- **Master Password**: Single master password to access your vault

### 📱 Cross-Platform
- **Mobile App**: Native Android app built with Capacitor
- **Web App**: Progressive Web App (PWA) support
- **Responsive Design**: Optimized for all screen sizes

### 🎨 User Experience
- **Dark/Light Theme**: Customizable theme modes
- **Accessibility**: Font size adjustment and color filters
- **Intuitive Interface**: Clean, modern design with easy navigation
- **Search & Filter**: Quick password search and category filtering

### 🛠 Password Management
- **Secure Storage**: Store passwords, usernames, URLs, and notes
- **Password Generator**: Generate strong, secure passwords
- **Categories**: Organize passwords by categories
- **Password Strength Analysis**: Real-time password strength checking
- **Bulk Operations**: Edit and delete multiple passwords

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** - Database-level security
- **Real-time subscriptions** - Live data updates

### Mobile
- **Capacitor** - Cross-platform native runtime
- **Android SDK** - Native Android features

### Authentication & Security
- **Corbado** - Biometric authentication and passkeys
- **Twilio Verify** - SMS OTP verification
- **Custom Encryption** - Client-side password encryption

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Android Studio (for mobile development)
- Supabase account
- Twilio account (for SMS) - only numbers verified by Twilio can receive the OTP
- Corbado account (for biometrics)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SafeKey_Final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CORBADO_PROJECT_ID=your_corbado_project_id
   VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
   VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
   VITE_TWILIO_VERIFY_SERVICE_SID=your_twilio_verify_service_sid
   ```

4. **Database Setup**
   - Set up your Supabase project
   - Run the database migrations (SQL files should be provided)
   - Configure Row Level Security policies

5. **Development Server**
   ```bash
   npm run dev
   ```

### Mobile Build

1. **Build the web app**
   ```bash
   npm run build
   ```

2. **Sync with Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

## Project Structure

```
SafeKey_Final/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BiometricAuth.tsx
│   │   ├── BottomNavigation.tsx
│   │   └── Header.tsx
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/                # External service clients
│   │   ├── corbadoClient.ts
│   │   ├── supabaseClient.ts
│   │   └── twilioClient.ts
│   ├── pages/              # Application pages/screens
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── ViewPasswords.tsx
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   ├── encryption.tsx
│   │   ├── passwordManager.tsx
│   │   └── autoLock.tsx
│   ├── App.tsx             # Main application component
│   └── AppRouter.tsx       # Route configuration
├── android/                # Android native project
├── public/                 # Static assets
├── capacitor.config.ts     # Capacitor configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Usage

### Getting Started
1. **Sign Up**: Create a new account with username, master password, and phone number
2. **Setup Security**: Enable biometric authentication and configure security settings
3. **Add Passwords**: Start adding your passwords with the "Add Password" feature
4. **Organize**: Use categories to organize your passwords
5. **Access**: Use biometric, PIN, or master password to access your vault

### Security Best Practices
- Use a strong, unique master password
- Enable biometric authentication for quick access
- Set up auto-lock for enhanced security
- Regularly update your passwords
- Use the password generator for new accounts

## API Integration

### Supabase Database Schema
- `users` - User accounts and authentication
- `passwords` - Encrypted password storage
- `categories` - Password categories
- `security_settings` - User security preferences

### External Services
- **Corbado**: Handles biometric authentication and passkey management
- **Twilio Verify**: Provides SMS-based OTP verification
- **Supabase**: Backend database and real-time features

## Security Architecture

### Encryption
- Client-side encryption using XOR cipher (demo implementation)
- Master key derivation from user password
- Encrypted storage in Supabase database

### Authentication Flow
1. Username/password verification
2. Optional biometric verification
3. Optional PIN verification
4. Session management with auto-lock

### Data Protection
- Row Level Security (RLS) in Supabase
- Encrypted password storage
- Secure session management
- Auto-lock functionality

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the FAQ section in the app

## Roadmap

### Security Enhancements
- Hardware security key support
- Advanced encryption algorithms
- Zero-knowledge architecture
- Audit logging
- Security breach notifications

---

**Note**: This is a demonstration project. For production use, implement proper encryption libraries and security practices.