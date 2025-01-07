export type RootStackParamList = {
  Home: undefined;
  ActiveRun: undefined;
  RunSummary: {
    route: Array<{latitude: number, longitude: number}>;
    distance: number;
    duration: number;
  };
  Profile: {
    userId: string;
  };
  Goals: undefined;
  Settings: undefined;
};
