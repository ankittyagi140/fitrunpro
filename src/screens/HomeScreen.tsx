import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Colors, ThemeName } from '../theme/colors';
import { Typography } from '../theme/typography';
import { RootStackParamList } from '../navigation/types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme, themeName, changeTheme } = useTheme();
  const user = useSelector((state: any) => state.user?.profile || {});
  const recentRuns = useSelector((state: any) => state.run?.pastRuns || []);

  const calculateTotalDistance = () => {
    if (!recentRuns || recentRuns.length === 0) return '0.0';
    return recentRuns.reduce((total: number, run: any) => 
      total + (run.stats?.distance || 0), 0).toFixed(1);
  };

  const themeOptions: ThemeName[] = ['light', 'dark', 'energetic', 'pastel'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: theme.primary }]}>
        <Text style={[styles.greeting, { color: theme.white }]}>
          Welcome, {user.name || 'Runner'}!
        </Text>
        <TouchableOpacity 
          style={[styles.startRunButton, { backgroundColor: theme.white }]}
          onPress={() => navigation.navigate('ActiveRun')}
        >
          <Text style={[styles.startRunText, { color: theme.primary }]}>Start Run</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.sectionContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Theme Selector</Text>
        <View style={styles.themeContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity 
              key={option}
              style={[
                styles.themeButton, 
                { 
                  backgroundColor: themeName === option ? theme.primary : theme.background,
                  borderColor: theme.gray
                }
              ]}
              onPress={() => changeTheme(option)}
            >
              <Text style={[
                styles.themeButtonText, 
                { 
                  color: themeName === option ? theme.white : theme.text.primary 
                }
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.sectionContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Recent Runs</Text>
        {recentRuns.length === 0 ? (
          <Text style={[styles.emptyRunsText, { color: theme.gray }]}>No runs recorded yet</Text>
        ) : (
          recentRuns.slice(0, 3).map((run: any, index: number) => (
            <View key={index} style={[styles.runCard, { backgroundColor: theme.background }]}>
              <View style={styles.runCardContent}>
                <Text style={[styles.runCardTitle, { color: theme.text.primary }]}>
                  {run.type || 'Run'} - {(run.stats?.distance || 0).toFixed(2)} km
                </Text>
                <Text style={[styles.runCardSubtitle, { color: theme.gray }]}>
                  Duration: {run.stats?.duration || 0} min | 
                  Pace: {(run.stats?.pace || 0).toFixed(2)} min/km
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={[styles.sectionContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Quick Stats</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {recentRuns.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Total Runs</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {calculateTotalDistance()} km
            </Text>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Total Distance</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
  },
  greeting: {
    ...Typography.title,
    marginBottom: 15,
  },
  startRunButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startRunText: {
    ...Typography.subtitle,
  },
  sectionContainer: {
    padding: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: 15,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeButtonText: {
    ...Typography.caption,
  },
  emptyRunsText: {
    ...Typography.body,
    textAlign: 'center',
  },
  runCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  runCardContent: {
    flexDirection: 'column',
  },
  runCardTitle: {
    ...Typography.body,
    fontWeight: 'bold',
  },
  runCardSubtitle: {
    ...Typography.caption,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    ...Typography.subtitle,
  },
  statLabel: {
    ...Typography.caption,
  },
});

export default HomeScreen;
