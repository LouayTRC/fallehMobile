

// src/screens/ConfigScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { Text, TextInput, } from 'react-native-paper';

import { useConfig } from '../context/configContext';
import theme from '../theme';
import { TransactionService } from '../database/services/transactionService';

const SettingsScreen = () => {
  const { adminPassword, pricePerKg, setAdminPassword, setPricePerKg } = useConfig();

  // États locaux pour les inputs
  const [newPassword, setNewPassword] = useState('');
  const [newPrice, setNewPrice] = useState('');


  const saveConfig = async () => {
    let hasChanges = false;

    if (newPassword.trim() !== '' && newPassword !== adminPassword) {
      setAdminPassword(newPassword);
      hasChanges = true;
    }

    const priceNum = parseFloat(newPrice);
    if (!isNaN(priceNum) && priceNum > 0 && priceNum !== pricePerKg) {
      setPricePerKg(priceNum);
      hasChanges = true;
    }

    if (hasChanges) {
      Alert.alert('Succès', 'Configuration mise à jour.');
      setNewPassword("")
      setNewPrice("")
    } else {
      Alert.alert('Aucune modification', 'Aucune valeur n\'a été modifiée.');
    }
  };


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Mot de passe Admin :</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={'gray'}
          textColor='white'
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Mot de passe"
        />

        <Text style={styles.label}>Prix par kg :</Text>
        <TextInput
          style={[styles.input, { marginBottom: 20 }]}
          placeholderTextColor={'gray'}
          textColor='white'
          value={newPrice}
          keyboardType="numeric"
          onChangeText={setNewPrice}
          placeholder="Prix en TND"
        />

        <Button title="Enregistrer" color={theme.colors.falleh} onPress={saveConfig} />
      </View>


      <View>
        <Button title="Exporter Excel" color={'#a78bfa'} onPress={async () => {
          const service = new TransactionService();
          const res = await service.exportTransactionsToExcel();
          if (res) {
            Alert.alert("Succès", "Base de données importé en Excel")
          } else {
            Alert.alert("Problème", "Erreur lors de l'importation de la BD")
          }
        }} />

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: theme.colors.background, flexDirection: "column", justifyContent: "space-between" },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 7,
    marginBottom: 4,
    color: 'white',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: theme.colors.cardsBackground,
  },
});

export default SettingsScreen;
