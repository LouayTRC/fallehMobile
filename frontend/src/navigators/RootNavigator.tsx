
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { use, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import { UserStackNavigator } from "./UserNavigator";
import { useAuth } from "../context/authContext";

// import {ParentStackNavigator} from "./ParentStacks";


export type RootStackParams = {
    Login: undefined;
    UserStack:undefined
};

const RootStack = createNativeStackNavigator<RootStackParams>()

export const RootNavigator = () => {


    const {connected} = useAuth();

    
    

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!connected ? (
                <RootStack.Screen name="Login" component={LoginScreen} />
            ) : (
                <RootStack.Screen name="UserStack" component={UserStackNavigator} />
            )}
        </RootStack.Navigator>
    );
    
}