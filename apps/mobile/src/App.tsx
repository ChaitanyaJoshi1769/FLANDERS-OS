import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { store } from './redux/store';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { initializeApp } from './redux/slices/auth.slice';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import FleetsScreen from './screens/fleets/FleetsScreen';
import MachinesScreen from './screens/machines/MachinesScreen';
import MissionsScreen from './screens/missions/MissionsScreen';
import IncidentsScreen from './screens/safety/IncidentsScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ title: 'Fleet Dashboard' }}
      />
    </Stack.Navigator>
  );
}

function FleetsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="FleetsHome"
        component={FleetsScreen}
        options={{ title: 'Fleets' }}
      />
      <Stack.Screen
        name="MachinesDetail"
        component={MachinesScreen}
        options={{ title: 'Machines' }}
      />
    </Stack.Navigator>
  );
}

function MissionsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MissionsHome"
        component={MissionsScreen}
        options={{ title: 'Autonomous Missions' }}
      />
    </Stack.Navigator>
  );
}

function SafetyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="SafetyHome"
        component={IncidentsScreen}
        options={{ title: 'Safety & Incidents' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1f2937',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Fleets') {
            iconName = focused ? 'truck' : 'truck-outline';
          } else if (route.name === 'Missions') {
            iconName = focused ? 'robot' : 'robot-outline';
          } else if (route.name === 'Safety') {
            iconName = focused ? 'alert' : 'alert-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#f3f4f6',
          borderTopColor: '#e5e7eb',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Fleets"
        component={FleetsStack}
        options={{ title: 'Fleets' }}
      />
      <Tab.Screen
        name="Missions"
        component={MissionsStack}
        options={{ title: 'Missions' }}
      />
      <Tab.Screen
        name="Safety"
        component={SafetyStack}
        options={{ title: 'Safety' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={AppTabs} />
      ) : (
        <Stack.Screen
          name="Auth"
          component={Stack.Navigator as any}
          options={{
            animationEnabled: false,
          }}
          listeners={({ navigation }) => ({
            beforeRemove: (e) => {
              e.preventDefault();
            },
          })}
        />
      )}
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeApp());

    const subscription = Notifications.addNotificationResponseListener(
      (response) => {
        console.log('Notification received:', response);
      }
    );

    return () => subscription.remove();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
