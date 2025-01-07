import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import LocationService from '../services/LocationService';
import { startRun, updateRunStats, finishRun } from '../store/runSlice';
import { Typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';

type ActiveRunScreenProps = NativeStackScreenProps<RootStackParamList, 'ActiveRun'>;

const ActiveRunScreen: React.FC<ActiveRunScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [route, setRoute] = useState<Array<{latitude: number, longitude: number}>>([
    { latitude: 37.78825, longitude: -122.4324 }
  ]);
  
  const locationServiceRef = useRef<LocationService | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize location tracking
    locationServiceRef.current = new LocationService();

    // Start run in Redux store
    dispatch(startRun());

    return () => {
      // Cleanup
      if (locationServiceRef.current) {
        locationServiceRef.current.stopTracking();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTracking = async () => {
    if (locationServiceRef.current) {
      setIsRunning(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      // Start location tracking
      await locationServiceRef.current.startTracking((location) => {
        const newPoint = {
          latitude: location.latitude,
          longitude: location.longitude
        };
        
        // Update route
        setRoute(prevRoute => [...prevRoute, newPoint]);
        
        // Calculate distance
        const newDistance = locationServiceRef.current?.calculateDistance(route) || 0;
        setDistance(newDistance);

        // Update run stats in Redux
        dispatch(updateRunStats({
          distance: newDistance,
          duration: elapsedTime,
          pace: newDistance > 0 ? elapsedTime / newDistance : 0
        }));
      });
    }
  };

  const stopTracking = () => {
    if (locationServiceRef.current) {
      setIsRunning(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop location tracking and get final route
      const finalRoute = locationServiceRef.current.stopTracking();

      // Dispatch finish run action
      dispatch(finishRun({
        distance,
        duration: elapsedTime,
        pace: distance > 0 ? elapsedTime / distance : 0,
        calories: estimateCaloriesBurned()
      }));

      // Navigate back or to run summary
      navigation.navigate('RunSummary', { route, distance, duration: elapsedTime });
    }
  };

  const estimateCaloriesBurned = () => {
    // Simple calorie estimation (very rough approximation)
    // Assumes average weight of 70kg and moderate intensity
    return (elapsedTime / 60) * 7;
  };

  // Fallback for web
  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.mapFallback, { backgroundColor: theme.background }]}>
          <Text style={[styles.mapFallbackText, { color: theme.gray }]}>Map not available on web</Text>
        </View>
      );
    }

    return (
      <MapView
        provider={Platform.OS === 'web' ? PROVIDER_DEFAULT : undefined}
        style={styles.map}
        initialRegion={{
          latitude: route[0].latitude,
          longitude: route[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {route.length > 1 && (
          <Polyline
            coordinates={route}
            strokeColor={theme.primary}
            strokeWidth={6}
          />
        )}
      </MapView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderMap()}

      <View style={[styles.statsContainer, { backgroundColor: theme.white }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Distance</Text>
          <Text style={[styles.statValue, { color: theme.primary }]}>{distance.toFixed(2)} km</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Time</Text>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {Math.floor(elapsedTime / 60)}:
            {(elapsedTime % 60).toString().padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.gray }]}>Pace</Text>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {distance > 0 
              ? `${(elapsedTime / distance / 60).toFixed(2)} min/km`
              : '0:00'}
          </Text>
        </View>
      </View>

      <View style={[styles.controlsContainer, { backgroundColor: theme.white }]}>
        {!isRunning ? (
          <TouchableOpacity 
            style={[styles.startButton, { backgroundColor: theme.success }]}
            onPress={startTracking}
          >
            <Text style={[styles.buttonText, { color: theme.white }]}>Start Run</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.stopButton, { backgroundColor: theme.danger }]}
            onPress={stopTracking}
          >
            <Text style={[styles.buttonText, { color: theme.white }]}>Stop Run</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFallbackText: {
    ...Typography.subtitle,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
  },
  statValue: {
    ...Typography.subtitle,
  },
  controlsContainer: {
    padding: 20,
  },
  startButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.subtitle,
  },
});

export default ActiveRunScreen;
