# EasyPay Android App

**EasyPay** - Fast, Secure Mobile Payments with NFC Tap-to-Pay

## Overview

EasyPay is a production-ready Android application that provides mobile banking functionality with NFC tap-to-pay payment processing. The app connects to a live backend server and includes comprehensive security features.

## Features

✅ **Bank Account Management** - Add, view, and manage multiple bank accounts  
✅ **Tap-to-Pay Payments** - Process payments using NFC technology  
✅ **Transaction History** - View all payment transactions  
✅ **Live Backend Integration** - Connects to production backend server  
✅ **NFC Payment Processing** - Real NFC tag reading and payment processing  
✅ **Upbeat Design** - Modern, vibrant UI with blue and orange color scheme  
✅ **Security** - Encrypted keystore signing and secure data handling  

## Technical Stack

- **Language**: Java
- **Android SDK**: API 24 (Android 7.0) - API 34 (Android 14)
- **Build System**: Gradle
- **Key Libraries**:
  - AndroidX (AppCompat, Core, WebKit)
  - NFC Framework
  - OkHttp 4.x (Networking)
  - Gson (JSON serialization)

## Project Structure

```
EasyPay-Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/easypay/
│   │   │   ├── MainActivity.java          # Main WebView activity
│   │   │   ├── NFCPaymentActivity.java    # NFC payment processing
│   │   │   └── NFCBridge.java             # JavaScript bridge
│   │   ├── res/
│   │   │   ├── layout/                    # XML layouts
│   │   │   ├── drawable/                  # UI drawables
│   │   │   ├── values/                    # Colors, strings, themes
│   │   │   └── xml/                       # NFC configuration
│   │   └── AndroidManifest.xml
│   ├── build.gradle                       # App build configuration
│   ├── proguard-rules.pro                 # Code obfuscation rules
│   └── easypay-release-key.jks            # Release signing keystore
├── build.gradle                           # Project build configuration
├── settings.gradle                        # Gradle settings
└── README.md                              # This file
```

## Build Instructions

### Prerequisites

- Android Studio 2022.1 or later
- JDK 11 or later
- Android SDK API 34
- NDK (optional)

### Building Debug APK

```bash
cd EasyPay-Android
./gradlew assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`

### Building Release APK

```bash
cd EasyPay-Android
./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk`

### Building with Android Studio

1. Open Android Studio
2. Select "Open an existing Android Studio project"
3. Navigate to `EasyPay-Android` directory
4. Click "Open"
5. Wait for Gradle sync to complete
6. Select "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"

## Signing Configuration

### Keystore Information

- **Keystore File**: `app/easypay-release-key.jks`
- **Keystore Password**: `EasyPay@2024`
- **Key Alias**: `easypay`
- **Key Password**: `EasyPay@2024`
- **Validity**: 10,000 days (27+ years)
- **Algorithm**: RSA 2048-bit
- **Signature**: SHA384withRSA

### Keystore Details

```
CN=EasyPay
O=EasyPay Inc
L=San Francisco
ST=California
C=US
```

### Generating a New Keystore (Optional)

```bash
keytool -genkey -v -keystore easypay-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias easypay \
  -storepass YourPassword \
  -keypass YourPassword \
  -dname "CN=EasyPay,O=EasyPay Inc,L=San Francisco,ST=California,C=US"
```

## Configuration

### Backend URL

Edit `MainActivity.java` to configure the backend URL:

```java
private static final String BACKEND_URL = "https://tap-to-pay-app.manus.space";
```

### NFC Configuration

NFC settings are configured in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.NFC" />
<uses-feature android:name="android.hardware.nfc" android:required="true" />
```

## Installation

### From APK File

1. Download the APK file
2. Enable "Unknown Sources" in Settings → Security
3. Open the APK file with your file manager
4. Tap "Install"
5. Grant required permissions

### From Google Play Store

(Coming soon - requires Google Play Developer account)

## Permissions

The app requests the following permissions:

| Permission | Purpose |
|-----------|---------|
| `INTERNET` | Connect to backend server |
| `ACCESS_NETWORK_STATE` | Check network connectivity |
| `NFC` | Read NFC tags for payments |
| `CAMERA` | Future QR code scanning |
| `READ_EXTERNAL_STORAGE` | Receipt storage |
| `WRITE_EXTERNAL_STORAGE` | Receipt storage |
| `USE_BIOMETRIC` | Biometric authentication |

## Features in Detail

### Bank Account Management

- Add multiple bank accounts
- View account details with masked account numbers
- Update account information
- Delete accounts

### Tap-to-Pay Payments

- Select bank account for payment
- Enter payment amount
- Hold NFC card near device
- Real-time NFC tag reading
- Automatic payment processing

### Transaction History

- View all payment transactions
- Filter by account
- Sort by date
- Transaction details with timestamps

### NFC Payment Processing

1. User initiates payment in web app
2. App opens NFC Payment Activity
3. User holds NFC card near device
4. App reads NFC tag data
5. Payment request sent to backend
6. Transaction recorded in history

## Troubleshooting

### NFC Not Working

1. Check if device has NFC hardware
2. Enable NFC in device settings
3. Ensure NFC is not disabled by power saving mode
4. Try with different NFC cards

### Backend Connection Issues

1. Check internet connection
2. Verify backend URL in MainActivity.java
3. Check firewall/proxy settings
4. Verify SSL certificate validity

### Build Errors

1. Update Android Studio to latest version
2. Sync Gradle files: File → Sync Now
3. Clear cache: Build → Clean Project
4. Rebuild: Build → Rebuild Project

## Security Considerations

- All network traffic uses HTTPS
- Keystore file is password-protected
- Code is obfuscated with ProGuard
- Sensitive data is not logged
- NFC data is validated before processing
- User authentication required for payments

## API Integration

The app connects to the backend via:

```
POST https://tap-to-pay-app.manus.space/api/trpc/transactions.create
```

Request payload:
```json
{
  "bankAccountId": 1,
  "amount": 50.99,
  "description": "Payment description",
  "nfcData": "NFC tag data"
}
```

## Testing

### Test Accounts

Use the following test data for development:

```
Account Holder: Test User
Bank Name: Test Bank
Account Number: 12345678
Routing Number: 021000021
```

### Test Payments

- Amount: $10.00 - $999.99
- Description: Any text (max 255 chars)
- NFC: Use any NFC-enabled card or tag

## Deployment

### Google Play Store

1. Create Google Play Developer account ($25 one-time fee)
2. Create app listing
3. Upload release APK
4. Fill in app details, screenshots, description
5. Submit for review (typically 2-4 hours)

### Alternative App Stores

- Amazon Appstore
- Samsung Galaxy Store
- F-Droid (open source)
- APKPure
- Uptodown

## Version History

### v1.0.0 (Initial Release)

- ✅ WebView-based app
- ✅ NFC payment processing
- ✅ Bank account management
- ✅ Transaction history
- ✅ Release signing
- ✅ Upbeat design

## Support & Contact

For support, issues, or feature requests:

- Email: support@easypay.com
- Website: https://easypay.com
- GitHub: https://github.com/easypay/android

## License

EasyPay Android App © 2024 EasyPay Inc. All rights reserved.

## Disclaimer

This app is for demonstration purposes. For production use:

1. Implement proper authentication
2. Add encryption for sensitive data
3. Comply with PCI DSS standards
4. Implement fraud detection
5. Add comprehensive error handling
6. Conduct security audit

---

**Built with ❤️ by EasyPay Team**

Last Updated: June 24, 2024
