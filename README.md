# WebApp to App Changer 📱

A powerful, production-ready template for transforming your web applications (Next.js, React, Vue, etc.) into high-performance native mobile applications using **Expo** and **React Native WebView**.

## 🎯 The Target

This project is designed for teams and developers who already have a robust web application and want to:
- **Minimize Time-to-Market**: Skip rebuilding the entire UI in native code.
- **Unified Experience**: Maintain a single codebase for web and mobile while leveraging native capabilities.
- **Native Polish**: Provide a "real app" feel with custom splash screens, native loaders, offline handling, and deep linking.

## ✨ Key Features

- **🚀 Native-Web Bridge**: Seamlessly communicate between your web app and the native container. Automatically injects `NATIVE_CONTEXT` and `AUTH_TOKEN`.
- **🌐 Offline Ready**: Built-in network monitoring with a custom "Offline State" UI to handle connectivity drops gracefully.
- **🎨 Branded Experience**: Fully customizable native loaders and splash screens that match your brand identity.
- **🔗 Smart Navigation**: Intelligent handling of external links (Open in Browser) vs. internal application routing.
- **🔒 Secure**: Environment-based configuration for API endpoints and sensitive tokens.
- **⚡ Performance Optimized**: Configurable WebView caching, hardware acceleration, and optimized deceleration rates.

## 🛠️ Getting Started

### Prerequisites
- Node.js (>= 20.19.0)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (for local development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd webapp-to-app-changer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy the example environment file and update it with your web app's details:
   ```bash
   cp .env.example .env
   ```

## ⚙️ Configuration

Update your `.env` file with the following variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_WEB_APP_URL` | The URL of your web application | `https://your-nextjs-domain.com` |
| `EXPO_PUBLIC_BRAND_NAME` | Your brand name for loaders/UI | `Your Brand` |
| `EXPO_PUBLIC_WEBVIEW_CACHE_ENABLED` | Enable/Disable WebView caching | `true` |
| `EXPO_PUBLIC_NATIVE_AUTH_TOKEN` | Optional static token for auth | `""` |

## 🚀 Development & Building

### Start Development Server
```bash
npm start
```
*Press `i` for iOS or `a` for Android.*

### Type Checking & Linting
```bash
npm run typecheck
npm run lint
```

### Build for Production (via EAS)
```bash
# Preview build
eas build --profile preview --platform android

# Production build
npm run build:android
npm run build:ios 
```

## 🌉 The Native-Web Bridge

The app automatically injects a bridge into your web application. You can listen for the following message types in your web app:

- `NATIVE_CONTEXT`: Contains device info, platform, and app version.
- `AUTH_TOKEN`: If configured, passes the native session token to the web view.

**To trigger native actions from your Web App:**
```javascript
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'OPEN_EXTERNAL_URL',
  payload: { url: 'https://example.com' }
}));
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
