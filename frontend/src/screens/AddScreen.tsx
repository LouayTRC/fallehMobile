import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton, Text, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import theme from '../theme';
import { ScrollView } from 'react-native-gesture-handler';
import { TransactionService } from '../database/services/transactionService';
import { useConfig } from '../config/configContext';

type FormData = {
  name: string;
  type: 'Falleh' | 'Base';
  kilos: string;
  boxes: string;
  litres: string;
  prixBase: string;
  comment: string;
};

const AddScreen: React.FC<any> = ({ navigation }) => {
  const transactionService = new TransactionService();
  const { pricePerKg } = useConfig();


  const { control, handleSubmit, watch, reset, formState } = useForm<FormData>({
    defaultValues: {
      name: '',
      type: 'Falleh',
      kilos: '',
      boxes: '',
      litres: '',
      prixBase: '',
      comment: ''
    },
    mode: 'onChange',
  });

  const type = watch('type');

  const onSubmit = async (data: FormData) => {
    console.log('Transaction:', data);
    await transactionService.addTransaction(data,pricePerKg);
    reset();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nom</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Ce champ est obligatoire' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Entrez le nom"
              placeholderTextColor="gray"
              textColor="white"
              value={value}
              onChangeText={onChange}
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.radioGroup}>
        {['Falleh', 'Base'].map((option) => (
          <View style={styles.radioOption} key={option}>
            <Controller
              control={control}
              name="type"
              rules={{ required: 'Ce champ est obligatoire' }}
              render={({ field: { onChange, value } }) => (
                <RadioButton
                  value={option}
                  status={value === option ? 'checked' : 'unchecked'}
                  onPress={() => onChange(option)}
                  color="#7e22ce"
                />
              )}
            />
            <Text style={styles.radioLabel}>{option === 'Falleh' ? 'Falleh' : 'Base'}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Kilos</Text>
      <Controller
        control={control}
        name="kilos"
        rules={{ required: 'Ce champ est obligatoire' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Entrez les kilos"
              placeholderTextColor="gray"
              textColor="white"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <Text style={styles.label}>Nombre de boîtes</Text>
      <Controller
        control={control}
        name="boxes"
        rules={{ required: 'Ce champ est obligatoire' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Entrez le nombre de boîtes"
              placeholderTextColor="gray"
              textColor="white"
              value={value}
              onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      {type == 'Base' && (
        <>
          <Text style={styles.label}>Nombre de Litres</Text>
          <Controller
            control={control}
            name="litres"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Entrez le nombre de litres"
                placeholderTextColor="gray"
                textColor="white"
                value={value}
                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
            )}
          />

          <Text style={styles.label}>Prix base</Text>
          <Controller
            control={control}
            name="prixBase"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Entrez le prix du base"
                placeholderTextColor="gray"
                textColor="white"
                value={value}
                onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
            )}
          />
        </>
      )}
      <Text style={styles.label}>Commentaire</Text>
      <Controller
        control={control}
        name="comment"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Entrez un commentaire"
              placeholderTextColor="gray"
              textColor="white"
              value={value}
              onChangeText={onChange}
            />
          </>
        )}
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          { opacity: formState.isValid ? 1 : 0.5 },
        ]}
        disabled={!formState.isValid}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.submitText}>Ajouter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: theme.colors.background,
  },
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
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  radioGroup: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#7e22ce',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddScreen;
