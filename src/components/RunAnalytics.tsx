import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory-native';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../theme/typography';

interface RunAnalyticsProps {
  runData: {
    distance: number[];
    pace: number[];
    elevation: number[];
  };
}

const RunAnalytics: React.FC<RunAnalyticsProps> = ({ runData }) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  // Prepare data for Victory charts
  const distanceData = runData.distance.map((d, i) => ({ x: i, y: d }));
  const paceData = runData.pace.map((p, i) => ({ x: i, y: p }));
  const elevationData = runData.elevation.map((e, i) => ({ x: i, y: e }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
        Run Analytics
      </Text>

      <View style={[styles.chartContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.chartTitle, { color: theme.text.primary }]}>
          Distance Progression (km)
        </Text>
        <VictoryChart
          width={screenWidth - 40}
          theme={VictoryTheme.material}
          domainPadding={10}
        >
          <VictoryAxis 
            style={{ 
              axis: { stroke: theme.gray },
              tickLabels: { fill: theme.text.secondary } 
            }}
          />
          <VictoryAxis 
            dependentAxis 
            style={{ 
              axis: { stroke: theme.gray },
              tickLabels: { fill: theme.text.secondary } 
            }}
          />
          <VictoryLine
            data={distanceData}
            style={{
              data: { 
                stroke: theme.primary,
                strokeWidth: 3 
              }
            }}
          />
        </VictoryChart>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.chartTitle, { color: theme.text.primary }]}>
          Pace Progression (min/km)
        </Text>
        <VictoryChart
          width={screenWidth - 40}
          theme={VictoryTheme.material}
          domainPadding={10}
        >
          <VictoryAxis 
            style={{ 
              axis: { stroke: theme.gray },
              tickLabels: { fill: theme.text.secondary } 
            }}
          />
          <VictoryAxis 
            dependentAxis 
            style={{ 
              axis: { stroke: theme.gray },
              tickLabels: { fill: theme.text.secondary } 
            }}
          />
          <VictoryLine
            data={paceData}
            style={{
              data: { 
                stroke: theme.secondary,
                strokeWidth: 3 
              }
            }}
          />
        </VictoryChart>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: theme.white }]}>
        <Text style={[styles.chartTitle, { color: theme.text.primary }]}>
          Elevation Progression (m)
        </Text>
        <VictoryChart
          width={screenWidth - 40}
          theme={VictoryTheme.material}
          domainPadding={10}
        >
          <VictoryAxis 
            style={{ 
              axis: { stroke: theme.gray },
              tickLabels: { fill: theme.text.secondary } 
            }}
          />
          <VictoryAxis 
            dependentAxis 
            style={{ 
              axis: { stroke: theme.gray },
              tickLabels: { fill: theme.text.secondary } 
            }}
          />
          <VictoryLine
            data={elevationData}
            style={{
              data: { 
                stroke: theme.danger,
                strokeWidth: 3 
              }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    ...Typography.subtitle,
    marginBottom: 15,
    textAlign: 'center',
  },
  chartContainer: {
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RunAnalytics;
