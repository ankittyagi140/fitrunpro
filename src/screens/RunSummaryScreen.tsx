import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Share,
  Platform 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { saveRun } from '../store/runSlice';
import { Typography } from '../theme/typography';

type RunSummaryScreenProps = NativeStackScreenProps<RootStackParamList, 'RunSummary'>;

const RunSummaryScreen: React.FC<RunSummaryScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { route: runRoute, distance, duration } = route.params;

  const [runDetails, setRunDetails] = useState({
    distance: distance || 0,
    duration: duration || 0,
    pace: distance > 0 ? duration / distance : 0,
    calories: estimateCaloriesBurned(distance, duration)
  });

  useEffect(() => {
    // Save run to history when screen loads
    dispatch(saveRun({
      date: new Date().toISOString(),
      ...runDetails,
      route: runRoute
    }));
  }, []);

  function estimateCaloriesBurned(distance: number, duration: number): number {
    // Simple calorie estimation (very rough approximation)
    // Assumes average weight of 70kg and moderate intensity
    return (duration / 60) * 7;
  }

  const shareRunDetails = async () => {
    try {
      const shareMessage = `Just completed a run! 
Distance: ${runDetails.distance.toFixed(2)} km
Duration: ${Math.floor(runDetails.duration / 60)} mins ${runDetails.duration % 60} secs
Pace: ${runDetails.pace.toFixed(2)} min/km
Calories Burned: ${runDetails.calories.toFixed(0)}`;

      if (Platform.OS === 'web') {
        // Web sharing API
        await navigator.share({ text: shareMessage });
      } else {
        // Mobile sharing
        await Share.share({
          message: shareMessage,
          title: 'My FitRun Pro Run'
        });
      }
    } catch (error) {
      console.error('Sharing failed', error);
    }
  };

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={[styles.mapFallback, { backgroundColor: theme.background }]}>
          <Text style={[styles.mapFallbackText, { color: theme.gray }]}>
            Map not available on web
          </Text>
        </View>
      );
    }

    return (
      <MapView
        provider={Platform.OS === 'web' ? PROVIDER_DEFAULT : undefined}
        style={styles.map}
        initialRegion={{
          latitude: runRoute[0].latitude,
          longitude: runRoute[0].longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {runRoute.length > 1 && (
          <Polyline
            coordinates={runRoute}
            strokeColor={theme.primary}
            strokeWidth={6}
          />
        )}
      </MapView>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {renderMap()}

      <View style={[styles.summaryContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.summaryTitle, { color: theme.text.primary }]}>
          Run Summary
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Distance</Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {runDetails.distance.toFixed(2)} km
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Duration</Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {Math.floor(runDetails.duration / 60)} mins {runDetails.duration % 60} secs
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Pace</Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {runDetails.pace.toFixed(2)} min/km
            </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Calories</Text>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {runDetails.calories.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: theme.secondary }]}
          onPress={shareRunDetails}
        >
          <Text style={[styles.shareButtonText, { color: theme.white }]}>
            Share Run
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.success }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.saveButtonText, { color: theme.white }]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  map: {
    height: 250,
  },
  mapFallback: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFallbackText: {
    ...Typography.subtitle,
  },
  summaryContainer: {
    margin: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '45%',
    alignItems: 'center',
    marginVertical: 10,
  },
  statLabel: {
    ...Typography.caption,
    marginBottom: 5,
  },
  statValue: {
    ...Typography.subtitle,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  shareButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    ...Typography.body,
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.subtitle,
  },
});

export default RunSummaryScreen;
