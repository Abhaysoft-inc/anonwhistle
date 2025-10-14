# Components Directory

This directory contains all reusable React components for the AnonWhistle platform.

## Landing Page Components

### Navbar.js
Fixed navigation bar with logo, menu links, and CTA button.

### HeroSection.js
Hero section with main headline, description, CTAs, and statistics.

### FeaturesSection.js
Displays the 6 main technology features (Tor, Blockchain, AI, etc.).

### HowItWorksSection.js
4-step process visualization showing how the platform works.

### SecuritySection.js
Security features list and trust badges.

### CTASection.js
Call-to-action section encouraging users to get started.

### Footer.js
Site footer with links and copyright information.

## Registration Page Components

### WalletSelector.js
Wallet connection interface with support for MetaMask, WalletConnect, Coinbase, and generic Ethereum wallets.

**Props:**
- `onWalletConnect(address, wallet)` - Callback when wallet is connected

### SecurityFeatures.js
Displays security benefits of crypto wallet registration.

### RegistrationForm.js
Registration form shown after wallet connection.

**Props:**
- `walletAddress` - Connected wallet address
- `selectedWallet` - Selected wallet object
- `onDisconnect()` - Callback to disconnect wallet

## Usage

Import components individually:
```javascript
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
```

Or use named imports from index:
```javascript
import { Navbar, HeroSection, Footer } from '@/components';
```

## Component Structure

All components follow these principles:
- Client-side rendered (`'use client'` directive)
- Tailwind CSS for styling
- React Icons for iconography
- Responsive design (mobile-first)
- Dark theme with gradient accents
