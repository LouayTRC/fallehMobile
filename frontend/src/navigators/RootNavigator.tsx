
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { use, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import { UserStackNavigator } from "./UserNavigator";

// import {ParentStackNavigator} from "./ParentStacks";


export type RootStackParams = {
    Login: undefined;
    UserStack:undefined
};

const RootStack = createNativeStackNavigator<RootStackParams>()

export const RootNavigator = () => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const getSession=async ()=>{
        if (!user) {
            const u = await AsyncStorage.getItem('user');
            if (u) {
                setUser(JSON.parse(u))
            }
        }
    }

    useEffect(()=>{
        setLoading(false)
        getSession()
        console.log("user",user);
        
    },[user])


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <RootStack.Screen name="Login" component={LoginScreen} />
            ) : (
                <RootStack.Screen name="UserStack" component={UserStackNavigator} />
            )}
        </RootStack.Navigator>
    );
    
}