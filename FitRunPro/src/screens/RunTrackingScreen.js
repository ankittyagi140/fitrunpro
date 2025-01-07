import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RunTrackingScreen = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);

  const startRun = () => {
    setIsRunning(true);
    // TODO: Implement GPS tracking
  };

  const stopRun = () => {
    setIsRunning(false);
    // TODO: Save run data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Run Tracking</Text>
      {!isRunning ? (
        <Button title="Start Run" onPress={startRun} />
      ) : (
        <>
          <Text>Duration: {duration} seconds</Text>
          <Button title="Stop Run" onPress={stopRun} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default RunTrackingScreen;
