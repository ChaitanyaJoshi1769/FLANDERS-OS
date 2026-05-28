export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  color?: string;
}

export interface MapRoute {
  id: string;
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  color?: string;
}

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateBounds = (markers: MapMarker[]) => {
  if (markers.length === 0) {
    return null;
  }

  let minLat = markers[0].latitude;
  let maxLat = markers[0].latitude;
  let minLon = markers[0].longitude;
  let maxLon = markers[0].longitude;

  markers.forEach((marker) => {
    minLat = Math.min(minLat, marker.latitude);
    maxLat = Math.max(maxLat, marker.latitude);
    minLon = Math.min(minLon, marker.longitude);
    maxLon = Math.max(maxLon, marker.longitude);
  });

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: maxLat - minLat + 0.1,
    longitudeDelta: maxLon - minLon + 0.1,
  };
};

export const getMarkerColor = (status: string): string => {
  switch (status) {
    case 'active':
      return '#10b981';
    case 'inactive':
      return '#6b7280';
    case 'maintenance':
      return '#f59e0b';
    case 'incident':
      return '#ef4444';
    default:
      return '#3b82f6';
  }
};
