import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Dimensions, Pressable, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Card, List, Switch, TextInput, useTheme } from 'react-native-paper';
import { Transaction } from '../database/models/Transaction';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { TransactionService } from '../database/services/transactionService';
import { useFocusEffect } from '@react-navigation/native';
import { useConfig } from '../config/configContext';

const HomeScreen: React.FC<any> = ({ navigation }: any) => {
  const transactionService = new TransactionService()

  const { colors } = useTheme()
  const { width } = Dimensions.get('window');
  const cardWidth = width * 0.45;
  const { pricePerKg } = useConfig()

  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [filtredTransactions, setfiltredTransactions] = useState<Transaction[] | null>(null)
  const [paidStats, setPaidStats] = useState<any>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const transactions = await transactionService.getTransactions();
        setTransactions(transactions);
        setfiltredTransactions(transactions)
        console.log("transactions", transactions);
      };

      fetchData();
    }, [])
  );

  useEffect(() => {
    let filtred = []
    if (transactions && transactions.length > 0) {
      filtred = transactions.filter(f => f.name.toUpperCase().includes(searchQuery.toUpperCase()))
      setfiltredTransactions(filtred)
    }

  }, [searchQuery, transactions])


  useEffect(() => {
    const prepareNumbers = () => {
      if (transactions) {
        return {
          fallehs: {
            nombre: transactions.filter(t => t.type == "Falleh").length || 0,
            nbrPaid: transactions.filter(t => t.type == "Falleh" && t.paid).length || 0,
            nbrUnPaid: transactions.filter(t => t.type == "Falleh" && !t.paid).length || 0,
          },
          bases: {
            nombre: transactions.filter(t => t.type == "Base").length || 0,
            nbrPaid: transactions.filter(t => t.type == "Base" && t.paid).length || 0,
            nbrUnPaid: transactions.filter(t => t.type == "Base" && !t.paid).length || 0,
          }
        }
      }
    }

    setPaidStats(prepareNumbers())
  }, [transactions])

  const calculProgression = (nbr: number, total: number) => {

    if (total !== 0) {
      const progress = (nbr / total) * 100;
      return progress;
    }
    return 0;
  }

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleLongPress = (item: Transaction) => {
    setSelectedTransaction(item)
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await transactionService.updateTransaction(selectedTransaction, pricePerKg)
      setModalVisible(false);
      setSelectedTransaction(null)
      const updatedTransactions = await transactionService.getTransactions();
      setTransactions(updatedTransactions);
      setfiltredTransactions(updatedTransactions);
      console.log("update suceesfully");


    } catch (error) {
      console.log("error updating");

    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: colors.background
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    card: {
      borderRadius: 12,
      padding: 15,
      marginHorizontal: 3,
      elevation: 3,
      backgroundColor: theme.colors.cardsBackground
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 5,
    },
    summary: {
      fontSize: 12,
      color: 'gray',
    },
    progressText: {
      color: 'white',
      fontWeight: 'bold',
    },
    searchContainer: {
      flexDirection: 'row',
      margin: 4,
      height: 40,
      backgroundColor: colors.background,
      overflow: 'hidden',
      marginBottom: 8
    },
    searchInput: {
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: theme.colors.cardsBackground,
      fontSize: 14,
      marginRight: 12,
      borderRadius: 3,
      height: '100%',
      textAlignVertical: 'center'
    },
    searchButton: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.cardsBackground,
      borderRadius: 3,
    },
    transactionsContainer: {
      flex: 1,
      backgroundColor: theme.colors.cardsBackground,
      marginHorizontal: 3,
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2
    },
    transactionCard: {
      backgroundColor: 'transparent',
      padding: 16,
      // marginHorizontal: 10,
    },
    accordionContainer: {
      backgroundColor: theme.colors.cardsBackground,
      paddingHorizontal: 0,
      paddingVertical: 0,
      margin: 0,
    },
    accordionTitle: {
      paddingLeft: 8,
      paddingRight: 8,
      paddingVertical: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    transactionName: {
      fontSize: 16,
      fontWeight: '600',
      // color: colors.text,
    },
    transactionType: {
      fontSize: 14,
      color: '#666',
    },
    statusBadge: {
      paddingHorizontal: 8,
      // marginVertical:24,
      borderRadius: 12,
    },
    paidBadge: {
      backgroundColor: '#1E312B',
    },
    unpaidBadge: {
      backgroundColor: '#3D2C18',
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    paidText: {
      color: '#10b981',
    },
    unpaidText: {
      color: '#ef4444',
    },
    divider: {
      height: 1,
      backgroundColor: '#2D2D2D',
      overflow: 'hidden',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      marginTop: 10,
      color: '#999',
      fontSize: 16,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 'auto'
    },
    badgeIcon: {
      marginRight: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    closeText: { marginTop: 10, color: 'blue' },
    detailsLine:{
      flexDirection:"row",
      justifyContent:'space-between',
      marginHorizontal:8,
      marginVertical:2
    }
  });

  const modalStyles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',  // semi-transparent background
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#1e1e1e',  // dark background for modal content
      borderRadius: 10,
      width: '100%',
      maxWidth: 400,
      padding: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: 'white',
      marginBottom: 15,
      textAlign: 'center',
    },

    label: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 7,
      marginBottom: 4,
      color: 'white',
    },
    input: {
      height: 40,
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

    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#444',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 6,
    },
    selectedRadio: {
      backgroundColor: '#7e22ce',
    },


  });




  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {paidStats && (
          <>
            <Card style={[styles.card, { width: cardWidth }]}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={[styles.name, { color: '#8F35ED' }]}>
                    {paidStats.fallehs.nombre} Falleh
                  </Text>
                  <Text style={styles.summary}>
                    {paidStats.fallehs.nbrPaid} paid · {paidStats.fallehs.nbrUnPaid} unpaid
                  </Text>
                </View>
                <AnimatedCircularProgress
                  size={60}
                  width={8}
                  fill={calculProgression(paidStats.fallehs.nbrPaid, paidStats.fallehs.nombre)}
                  tintColor="#8F35ED"
                  backgroundColor="#2D2D2D"
                >
                  {(fill: number) => <Text style={styles.progressText}>{Math.round(fill)}%</Text>}
                </AnimatedCircularProgress>
              </View>
            </Card>

            <Card style={[styles.card, { width: cardWidth }]}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={[styles.name, { color: '#4682F4' }]}>
                    {paidStats.bases.nombre} Bases
                  </Text>
                  <Text style={styles.summary}>
                    {paidStats.bases.nbrPaid} paid · {paidStats.bases.nbrUnPaid} unpaid
                  </Text>
                </View>
                <AnimatedCircularProgress
                  size={60}
                  width={8}
                  fill={calculProgression(paidStats.bases.nbrPaid, paidStats.bases.nombre)}
                  tintColor="#4682F4"
                  backgroundColor="#2D2D2D"
                >
                  {(fill: number) => <Text style={styles.progressText}>{Math.round(fill)}%</Text>}
                </AnimatedCircularProgress>
              </View>
            </Card>
          </>
        )}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="gray"
          textColor='white'
          value={searchQuery}
          underlineColor='transparent'
          activeUnderlineColor='transparent'
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsContainer}>
        {filtredTransactions && filtredTransactions.length > 0 ? (
          <FlatList
            data={filtredTransactions}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item }) => (
              <List.Accordion
                title={
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Text
                      label={item.name.charAt(0).toUpperCase()}
                      size={36}
                      style={{ backgroundColor: item.type == 'Falleh' ? theme.colors.falleh : theme.colors.base, marginRight: 10 }}
                    />
                    <View>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                      <Text style={[styles.transactionType, { color: item.type == 'Falleh' ? theme.colors.falleh : theme.colors.base }]}>{item.type}</Text>
                    </View>
                  </View>
                }
                right={() => (
                  <View style={[styles.badge, item.paid ? styles.paidBadge : styles.unpaidBadge]}>
                    <Ionicons
                      name={item.paid ? "checkmark" : "close"}
                      size={14}
                      color={item.paid ? "#25785C" : "#C6993C"}
                      style={styles.badgeIcon}
                    />
                    <Text style={[styles.statusText, { color: item.paid ? "#25785C" : "#C6993C" }]}>{item.paid ? 'PAID' : 'UNPAID'}</Text>
                  </View>
                )}
                expanded={expandedId === item.id}
                onPress={() => toggleAccordion(item.id)}
                onLongPress={() => handleLongPress(item)}
                style={styles.accordionContainer}
                titleStyle={styles.accordionTitle}
              >
                <View style={{ padding: 5,marginBottom:5 }}>
                  <View style={styles.detailsLine}>
                    <Text style={{ color: 'gray' }}>KG:</Text>
                    <Text style={{ color: 'white' }}>{item.kilos}</Text>
                  </View>
                  <View style={styles.detailsLine}>
                    <Text style={{ color: 'gray' }}>Number of Bottles :</Text>
                    <Text style={{ color: 'white' }}>{item.boxes}</Text>
                  </View>
                  <View style={styles.detailsLine}>
                    <Text style={{ color: 'gray' }}>KGF</Text>
                    <Text style={{ color: 'white' }}>{item.kgf}</Text>
                  </View>
                  
                  
                  <View style={[styles.divider,{marginHorizontal:8,marginVertical:10}]} />
                  <View style={styles.detailsLine}>
                    <Text style={{ color: 'gray' }}>Price:</Text>
                    <Text style={{ color: '#6E67C7' }}>{item.price} TND</Text>
                  </View>
                  
                </View>
              </List.Accordion>
            )}
          />

        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        )}
      </View>

    </View>
  );
};

export default HomeScreen;