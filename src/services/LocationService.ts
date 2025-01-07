import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private locations: LocationPoint[] = [];

  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required', 
        'Location permissions are needed to track your run.'
      );
      return false;
    }
    return true;
  }

  async startTracking(callback: (location: LocationPoint) => void) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 10
      },
      (location) => {
        const newPoint: LocationPoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp
        };
        this.locations.push(newPoint);
        callback(newPoint);
      }
    );
  }

  stopTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
    }
    return this.locations;
  }

  calculateDistance(locations: LocationPoint[]): number {
    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      totalDistance += this.haversineDistance(
        locations[i-1].latitude, 
        locations[i-1].longitude,
        locations[i].latitude, 
        locations[i].longitude
      );
    }
    return totalDistance;
  }

  private haversineDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default LocationService;
