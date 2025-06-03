import React, { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from "./frontend/src/navigators/RootNavigator";
import { StyleSheet } from "react-native";

import theme from "./frontend/src/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDatabase } from "./frontend/src/database/db";
import { ConfigProvider, } from "./frontend/src/context/configContext";
import { AuthProvider } from "./frontend/src/context/authContext";

const App = () => {
  const [initialisedDB, setInitialisedDB] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing database...');
        await initDatabase();
        setInitialisedDB(true)
      } catch (err) {
        setInitialisedDB(false)
        console.error('Initialization error:', err);
      }
    };

    initializeApp();
  }, []);

  if (initialisedDB) {
    return (
      <ConfigProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
              <NavigationContainer>
                <SafeAreaView style={styles.container}>
                  <RootNavigator />
                </SafeAreaView>
              </NavigationContainer>
            </PaperProvider>
          </GestureHandlerRootView>
        </AuthProvider>

      </ConfigProvider>
    )
  }



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default App
