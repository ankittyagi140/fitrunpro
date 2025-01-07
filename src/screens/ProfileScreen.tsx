import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Image,
  Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { updateProfile, UserProfile } from '../store/userSlice';
import { Typography } from '../theme/typography';
import * as ImagePicker from 'expo-image-picker';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.user.profile);

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: userProfile.name || '',
    email: userProfile.email || '',
    age: userProfile.age || undefined,
    weight: userProfile.weight || undefined,
    height: userProfile.height || undefined,
    sex: userProfile.sex || undefined,
    profilePicture: userProfile.profilePicture || undefined,
    fitnessGoals: userProfile.fitnessGoals || {},
    trainingLevel: userProfile.trainingLevel || 'beginner'
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileData(prev => ({
        ...prev, 
        profilePicture: result.assets[0].uri 
      }));
    }
  };

  const handleSave = () => {
    // Validate input
    if (!profileData.name || !profileData.email) {
      Alert.alert('Validation Error', 'Name and email are required');
      return;
    }

    dispatch(updateProfile(profileData));
    setEditMode(false);
  };

  const renderProfilePicture = () => {
    return (
      <TouchableOpacity 
        style={[styles.profilePictureContainer, { 
          backgroundColor: theme.background,
          borderColor: theme.primary 
        }]}
        onPress={editMode ? pickImage : undefined}
      >
        {profileData.profilePicture ? (
          <Image 
            source={{ uri: profileData.profilePicture }} 
            style={styles.profilePicture} 
          />
        ) : (
          <Text style={[styles.profilePictureText, { color: theme.gray }]}>
            {profileData.name ? profileData.name[0].toUpperCase() : 'P'}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderProfileField = (
    label: string, 
    value: string | number | undefined, 
    key: keyof UserProfile,
    inputType: 'text' | 'number' = 'text'
  ) => {
    return (
      <View style={styles.profileField}>
        <Text style={[styles.profileFieldLabel, { color: theme.gray }]}>
          {label}
        </Text>
        {editMode ? (
          <TextInput
            style={[
              styles.profileFieldInput, 
              { 
                backgroundColor: theme.background,
                color: theme.text.primary,
                borderColor: theme.gray 
              }
            ]}
            value={value ? value.toString() : ''}
            onChangeText={(text) => setProfileData(prev => ({
              ...prev, 
              [key]: inputType === 'number' ? Number(text) : text
            }))}
            keyboardType={inputType === 'number' ? 'numeric' : 'default'}
          />
        ) : (
          <Text style={[styles.profileFieldValue, { color: theme.text.primary }]}>
            {value || 'Not set'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {renderProfilePicture()}

      <View style={[styles.profileSection, { backgroundColor: theme.white }]}>
        <View style={styles.profileHeader}>
          <Text style={[styles.profileTitle, { color: theme.text.primary }]}>
            Personal Information
          </Text>
          <TouchableOpacity 
            onPress={() => setEditMode(!editMode)}
            style={styles.editButton}
          >
            <Text style={[styles.editButtonText, { color: theme.primary }]}>
              {editMode ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {renderProfileField('Name', profileData.name, 'name')}
        {renderProfileField('Email', profileData.email, 'email')}
        {renderProfileField('Age', profileData.age, 'age', 'number')}
        {renderProfileField('Weight (kg)', profileData.weight, 'weight', 'number')}
        {renderProfileField('Height (cm)', profileData.height, 'height', 'number')}
        
        <View style={styles.profileField}>
          <Text style={[styles.profileFieldLabel, { color: theme.gray }]}>
            Sex
          </Text>
          {editMode ? (
            <View style={styles.sexSelector}>
              {['male', 'female', 'other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sexOption,
                    { 
                      backgroundColor: profileData.sex === option 
                        ? theme.primary 
                        : theme.background 
                    }
                  ]}
                  onPress={() => setProfileData(prev => ({ ...prev, sex: option as any }))}
                >
                  <Text style={[
                    styles.sexOptionText,
                    { 
                      color: profileData.sex === option 
                        ? theme.white 
                        : theme.text.primary 
                    }
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={[styles.profileFieldValue, { color: theme.text.primary }]}>
              {profileData.sex ? 
                profileData.sex.charAt(0).toUpperCase() + profileData.sex.slice(1) 
                : 'Not set'}
            </Text>
          )}
        </View>
      </View>

      <View style={[styles.profileSection, { backgroundColor: theme.white }]}>
        <Text style={[styles.profileTitle, { color: theme.text.primary }]}>
          Fitness Goals
        </Text>
        
        <View style={styles.profileField}>
          <Text style={[styles.profileFieldLabel, { color: theme.gray }]}>
            Training Level
          </Text>
          {editMode ? (
            <View style={styles.sexSelector}>
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.sexOption,
                    { 
                      backgroundColor: profileData.trainingLevel === level 
                        ? theme.primary 
                        : theme.background 
                    }
                  ]}
                  onPress={() => setProfileData(prev => ({ 
                    ...prev, 
                    trainingLevel: level as any 
                  }))}
                >
                  <Text style={[
                    styles.sexOptionText,
                    { 
                      color: profileData.trainingLevel === level 
                        ? theme.white 
                        : theme.text.primary 
                    }
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={[styles.profileFieldValue, { color: theme.text.primary }]}>
              {profileData.trainingLevel ? 
                profileData.trainingLevel.charAt(0).toUpperCase() + 
                profileData.trainingLevel.slice(1) 
                : 'Not set'}
            </Text>
          )}
        </View>

        {renderProfileField(
          'Weekly Run Distance (km)', 
          profileData.fitnessGoals?.weeklyRunDistance, 
          'fitnessGoals.weeklyRunDistance', 
          'number'
        )}
        
        {renderProfileField(
          'Calories Burn Goal', 
          profileData.fitnessGoals?.caloriesBurnGoal, 
          'fitnessGoals.caloriesBurnGoal', 
          'number'
        )}
      </View>

      {editMode && (
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.success }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: theme.white }]}>
            Save Profile
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  profilePictureContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  profilePictureText: {
    ...Typography.title,
    fontSize: 60,
  },
  profileSection: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileTitle: {
    ...Typography.subtitle,
  },
  editButton: {},
  editButtonText: {
    ...Typography.body,
  },
  profileField: {
    marginVertical: 10,
  },
  profileFieldLabel: {
    ...Typography.caption,
    marginBottom: 5,
  },
  profileFieldValue: {
    ...Typography.body,
  },
  profileFieldInput: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  sexSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  sexOptionText: {
    ...Typography.caption,
  },
  saveButton: {
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.subtitle,
  },
});

export default ProfileScreen;
