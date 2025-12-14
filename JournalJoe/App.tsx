import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import PatientRoot from './src/screens/patient/PatientRoot';
import TherapistRoot from './src/screens/therapist/TherapistRoot';

export type RootStackParamList = {
    Login: undefined;
    Patient: undefined;
    Therapist: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Patient" component={PatientRoot} />
                <Stack.Screen name="Therapist" component={TherapistRoot} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
