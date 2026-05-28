import * as Location from 'expo-location';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  heading: number;
  speed: number;
}

export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Location permission error:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      altitude: location.coords.altitude || 0,
      heading: location.coords.heading || 0,
      speed: location.coords.speed || 0,
    };
  } catch (error) {
    console.error('Get location error:', error);
    return null;
  }
};

export const startLocationTracking = (
  callback: (location: LocationCoordinates) => void,
  interval: number = 10000
) => {
  const subscription = Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: interval,
      distanceInterval: 10,
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        altitude: location.coords.altitude || 0,
        heading: location.coords.heading || 0,
        speed: location.coords.speed || 0,
      });
    }
  );

  return subscription;
};
