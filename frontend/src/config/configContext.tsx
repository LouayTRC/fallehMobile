// src/context/ConfigContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ConfigType = {
  adminPassword: string;
  pricePerKg: number;
  setAdminPassword: (newPass: string) => void;
  setPricePerKg: (newPrice: number) => void;
};

const ConfigContext = createContext<ConfigType | null>(null);

const ADMIN_PASSWORD_KEY = 'admin_pass';
const PRICE_PER_KG_KEY = 'price_kg';

const defaultAdminPassword = '1234';
const defaultPricePerKg = 0.2;

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminPassword, setAdminPasswordState] = useState<string>(defaultAdminPassword);
  const [pricePerKg, setPricePerKgState] = useState<number>(defaultPricePerKg);

  // Charger les valeurs depuis AsyncStorage au démarrage
  useEffect(() => {
    (async () => {
      try {
        const savedPassword = await AsyncStorage.getItem(ADMIN_PASSWORD_KEY);
        const savedPrice = await AsyncStorage.getItem(PRICE_PER_KG_KEY);

        if (savedPassword !== null) setAdminPasswordState(savedPassword);
        if (savedPrice !== null) setPricePerKgState(parseFloat(savedPrice));
      } catch (error) {
        console.warn('Erreur chargement config:', error);
      }
    })();
  }, []);

  // Fonction pour mettre à jour et sauvegarder mot de passe
  const setAdminPassword = async (newPass: string) => {
    setAdminPasswordState(newPass);
    try {
      await AsyncStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
    } catch (error) {
      console.warn('Erreur sauvegarde mot de passe:', error);
    }
  };

  // Fonction pour mettre à jour et sauvegarder prix/kg
  const setPricePerKg = async (newPrice: number) => {
    setPricePerKgState(newPrice);
    try {
      await AsyncStorage.setItem(PRICE_PER_KG_KEY, newPrice.toString());
    } catch (error) {
      console.warn('Erreur sauvegarde prix/kg:', error);
    }
  };

  return (
    <ConfigContext.Provider
      value={{ adminPassword, pricePerKg, setAdminPassword, setPricePerKg }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
