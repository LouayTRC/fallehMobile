import { createNativeStackNavigator } from "@react-navigation/native-stack"
import HomeScreen from "../screens/HomeScreen"
import StatsScreen from "../screens/StatsScreen"
import AddScreen from "../screens/AddScreen"
import SettingsScreen from "../screens/SettingsScreen"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React from "react"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from "react-native-paper"
import theme from "../theme"

export type UserStackParams = {
    Home:undefined
    Stats:undefined
    Add:undefined
    Settings:undefined
}
3

const Tab = createBottomTabNavigator();


export const UserStackNavigator = () => {
  const { colors } = useTheme();  // get theme colors
  const purple=theme.colors.falleh
  
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background, 
          shadowColor: 'transparent',      
          elevation: 0,
          height:80                     
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor: purple, 
        tabBarInactiveTintColor: '#757575', 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Stats':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Add':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarStyle: {
          paddingVertical: 5,
          height: 60,
          backgroundColor: colors.background,  // <-- use your theme background here
          // or use any color you want, e.g. '#ffffff' or '#333333'
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" options={{ headerTitle: 'Account Dashboard' }}  component={HomeScreen} />
      <Tab.Screen name="Stats" options={{ headerTitle: 'Stats' }}  component={StatsScreen} />
      <Tab.Screen name="Add"  options={{ headerTitle: 'Add' }}  component={AddScreen} />
      <Tab.Screen name="Settings" options={{ headerTitle: 'Settings' }}  component={SettingsScreen} />
    </Tab.Navigator>
  );
};

