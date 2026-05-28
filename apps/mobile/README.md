# FLANDERS OS Mobile Application

React Native/Expo mobile application for FLANDERS OS - Fleet Intelligence Platform. Provides real-time fleet monitoring, machine management, autonomous mission tracking, and safety incident reporting on iOS and Android.

## Architecture

### Technology Stack
- **Framework**: React Native 0.73.0 with Expo 50.0.0
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (Stack + Bottom Tab)
- **HTTP Client**: Axios with JWT auth interceptors
- **Storage**: Expo SecureStore (encrypted token storage)
- **Location**: Expo Location API
- **Notifications**: Expo Notifications
- **Maps**: Integration ready for react-native-maps

### Project Structure
```
apps/mobile/
├── src/
│   ├── screens/          # Screen components
│   │   ├── auth/         # Login, Register
│   │   ├── dashboard/    # Dashboard with fleet stats
│   │   ├── fleets/       # Fleet list management
│   │   ├── machines/     # Machine monitoring
│   │   ├── missions/     # Autonomous missions
│   │   ├── safety/       # Safety incidents
│   │   └── profile/      # User profile
│   ├── redux/            # State management
│   │   ├── slices/       # Redux slices (auth, fleet, machine, mission, incident)
│   │   ├── store.ts      # Redux store configuration
│   │   └── hooks.ts      # Typed hooks
│   ├── services/         # API and utility services
│   │   ├── api.ts        # Axios client with interceptors
│   │   ├── location.ts   # Location tracking service
│   │   ├── notifications.ts # Push notification service
│   │   └── maps.ts       # Map utilities
│   ├── types/            # TypeScript types and interfaces
│   └── App.tsx           # Main app component
├── app.json              # Expo configuration
└── package.json          # Dependencies
```

## Features

### 1. Authentication
- Email/password login and registration
- JWT token-based authentication
- Secure token storage using Expo SecureStore
- MFA ready architecture
- Automatic token refresh on 401 responses

### 2. Dashboard
- Fleet overview with statistics
- Active fleets count
- Pull-to-refresh functionality
- Real-time fleet status display

### 3. Fleet Management
- Fleet list with status indicators
- Machine count per fleet
- Status badges (active/inactive/maintenance)
- List refresh capability

### 4. Machine Monitoring
- Real-time machine status tracking
- Health metrics (health percentage)
- Operating temperature display
- Uptime tracking
- Status indicators (active/inactive/maintenance/decommissioned)
- Refresh on demand

### 5. Autonomous Missions
- Mission list with status tracking
- Operation mode indicators (autonomous/semi-autonomous/manual/remote)
- Waypoint tracking
- Progress percentage
- Estimated duration
- Mission status (pending/in_progress/completed/failed/aborted)

### 6. Safety Incidents
- Incident reporting and tracking
- Severity levels (low/medium/high/critical/catastrophic)
- Status management (open/investigating/resolved/closed/pending_review)
- Root cause documentation
- Incident history

### 7. User Profile
- User information display
- Logout functionality
- Profile management ready

### 8. Location Services
- Real-time location tracking
- Geofencing ready
- Distance calculations
- Location-based alerts

### 9. Push Notifications
- Incident alerts
- Mission updates
- Machine health warnings
- Customizable notification payloads

## Setup and Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator
- Expo Go app (for real device testing)

### Installation
```bash
cd apps/mobile
npm install
```

### Environment Configuration
Create `.env` file in `apps/mobile/`:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Running the App

#### Development
```bash
npm start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- `e` to send link to phone via QR code

#### Build for Production
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build
```

#### Submit to App Stores
```bash
# iOS App Store
eas submit --platform ios

# Google Play
eas submit --platform android
```

## API Integration

The mobile app communicates with the FLANDERS OS API backend at `/api` endpoint. Key endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Fleet Data
- `GET /fleets?organizationId={id}` - List fleets
- `GET /fleets/{id}` - Fleet details

### Machines
- `GET /machines?organizationId={id}` - List machines
- `GET /machines/{id}` - Machine details
- `PATCH /machines/{id}` - Update machine

### Missions
- `GET /autonomous/missions?organizationId={id}` - List missions
- `GET /autonomous/missions/{id}` - Mission details
- `POST /autonomous/missions` - Create mission
- `PATCH /autonomous/missions/{id}` - Update mission

### Safety
- `GET /safety/incidents?organizationId={id}` - List incidents
- `POST /safety/incidents` - Report incident
- `PATCH /safety/incidents/{id}` - Update incident

## State Management

Redux Toolkit state slices:

### Auth Slice
```typescript
{
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}
```

### Fleet Slice
```typescript
{
  fleets: Fleet[]
  selectedFleet: Fleet | null
  isLoading: boolean
  error: string | null
}
```

### Machine Slice
```typescript
{
  machines: Machine[]
  selectedMachine: Machine | null
  isLoading: boolean
  error: string | null
}
```

### Mission Slice
```typescript
{
  missions: Mission[]
  selectedMission: Mission | null
  isLoading: boolean
  error: string | null
}
```

### Incident Slice
```typescript
{
  incidents: Incident[]
  selectedIncident: Incident | null
  isLoading: boolean
  error: string | null
}
```

## Type Definitions

All TypeScript types are defined in `src/types/index.ts`:
- `User` - User profile
- `Fleet` - Fleet information
- `Machine` - Machine data
- `Mission` - Autonomous mission
- `Incident` - Safety incident
- State types for each Redux slice

## Security

### Token Management
- Tokens stored in Expo SecureStore (encrypted)
- Automatic token injection in API requests
- 401 error handling with logout trigger
- Secure session termination

### Data Protection
- HTTPS API communication
- JWT token validation
- Organization-level data isolation
- Secure password storage

## Testing

### Unit Tests (Coming Soon)
```bash
npm test
```

### E2E Tests (Coming Soon)
```bash
npm run e2e
```

### Manual Testing Checklist
- [ ] Login/Register flow
- [ ] Dashboard data loading
- [ ] Fleet list display
- [ ] Machine monitoring
- [ ] Mission tracking
- [ ] Incident reporting
- [ ] Location tracking
- [ ] Push notifications
- [ ] Offline functionality
- [ ] Network error handling

## Performance Optimization

- Redux Toolkit for efficient state updates
- Memoization of screen components
- Lazy loading for large lists
- Image optimization
- API request caching ready
- Location update batching

## Troubleshooting

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `npm start -- -c`
- Clear watchman cache: `watchman watch-del-all`

### API Connection Issues
- Verify API_URL in environment
- Check network connectivity
- Verify API server is running
- Check CORS settings on API

### Location Permission Issues
- Grant location permissions in app settings
- For iOS: Enable "Always" or "While Using" location access
- For Android: Grant location permission in app settings

## Future Enhancements

- [ ] Offline mode with local data sync
- [ ] Advanced map visualization
- [ ] Real-time data streaming via WebSocket
- [ ] Biometric authentication
- [ ] Dark mode support
- [ ] Multi-language localization
- [ ] Enhanced analytics tracking
- [ ] AR visualization for equipment

## Contributing

Follow the established patterns:
- Use functional components with hooks
- TypeScript for all new code
- Redux Toolkit for state management
- Consistent styling with Tailwind-inspired colors

## License

Part of FLANDERS OS - Enterprise Fleet Intelligence Platform
