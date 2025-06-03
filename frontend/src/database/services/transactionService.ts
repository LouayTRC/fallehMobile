
import { Transaction } from '../models/Transaction';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getDatabase } from '../db';
import { Alert } from 'react-native';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';

export class TransactionService {

    private db: SQLiteDatabase;

    constructor() {
        this.db = getDatabase();
    }

    async getTransactions(): Promise<Transaction[]> {
        try {
            const [results] = await this.db.executeSql(`SELECT * FROM Transactions ORDER BY created_at DESC;`);
            const transactions: Transaction[] = [];

            for (let i = 0; i < results.rows.length; i++) {
                transactions.push(results.rows.item(i));
            }

            return transactions;
        } catch (error) {
            console.error('Erreur lors de la récupération des transactions:', error);
            throw error;
        }
    }

    async addTransaction(data: any, pricePerKg: number) {
        const kgf = this.calculateKGF(data.kilos, data.boxes)
        console.log("here");

        const newTransaction: any = {
            name: data.name,
            type: data.type,
            kilos: data.kilos,
            boxes: data.boxes,
            kgf,
            paid: false,
            created_at: new Date(),
        };

        if (data.type == 'Falleh') {

            newTransaction.price = this.calculatePriceFalleh(newTransaction.kgf, pricePerKg)
        } else {
            if (data.litres) {
                newTransaction.litres = data.litres
            }
            if (data.prixBase) {
                newTransaction.prixBase = data.prixBase
            }

            if (newTransaction.litres && newTransaction.prixBase) {
                newTransaction.price = newTransaction.litres * newTransaction.prixBase
            }
            else {
                newTransaction.price = 0
            }
        }
        console.log("eee", newTransaction);

        await this.insertTransaction(newTransaction)
    }

    private calculateKGF(kilos: number, boxes: number): number {
        return kilos - (boxes * 35)
    }

    private calculatePriceFalleh(kgf: number, pricePerKg: number): number {
        const result = kgf * pricePerKg;

        return result < 50 ? 50 : result
    }

    async insertTransaction(data: Transaction) {
        try {
            if (data.type == 'Falleh') {
                await this.db.executeSql(
                    `INSERT INTO Transactions (name, type, kilos, boxes, kgf, price, paid, created_at, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.name,
                        data.type,
                        data.kilos,
                        data.boxes,
                        data.kgf,
                        data.price,
                        false,
                        new Date(),
                        data.comment || ''
                    ]
                );
            }
            else {
                await this.db.executeSql(
                    `INSERT INTO Transactions (name, type, kilos, boxes, kgf, litres, prixBase, price, paid, created_at, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.name,
                        data.type,
                        data.kilos,
                        data.boxes,
                        data.kgf,
                        data.litres || 0,
                        data.prixBase || 0,
                        data.price,
                        false,
                        new Date(),
                        data.comment || ''

                    ]
                );
            }

            console.log("transaction added successfully");
        } catch (error) {
            console.log("error adding transaction", error);
        }
    }


    async updateTransaction(data: any, pricePerKg: number) {
        try {
            const kgf = this.calculateKGF(data.kilos, data.boxes);

            const updatedTransaction: any = {
                name: data.name,
                type: data.type,
                kilos: data.kilos,
                boxes: data.boxes,
                kgf,
                paid: data.paid,
                updated_at: new Date(),
            };

            if (data.type === 'Falleh') {
                updatedTransaction.price = this.calculatePriceFalleh(kgf, pricePerKg);
            } else {
                if (data.litres) {
                    updatedTransaction.litres = data.litres;
                }
                if (data.prixBase) {
                    updatedTransaction.prixBase = data.prixBase;
                }
                if (updatedTransaction.litres && updatedTransaction.prixBase) {
                    updatedTransaction.price = updatedTransaction.litres * updatedTransaction.prixBase;
                } else {
                    updatedTransaction.price = 0;
                }
            }

            if (data.type === 'Falleh') {
                await this.db.executeSql(
                    `UPDATE Transactions SET 
                    kilos = ?, boxes = ?, kgf = ?, price = ?, paid = ? WHERE id = ?`,
                    [
                        updatedTransaction.kilos,
                        updatedTransaction.boxes,
                        updatedTransaction.kgf,
                        updatedTransaction.price,
                        updatedTransaction.paid,
                        data.id,
                    ]
                );
            } else {
                await this.db.executeSql(
                    `UPDATE Transactions SET 
                    kilos = ?, boxes = ?, kgf = ?, litres = ?, prixBase = ?, price = ?, paid = ? WHERE id = ?`,
                    [
                        updatedTransaction.kilos,
                        updatedTransaction.boxes,
                        updatedTransaction.kgf,
                        updatedTransaction.litres || 0,
                        updatedTransaction.prixBase || 0,
                        updatedTransaction.price,
                        updatedTransaction.paid,
                        data.id,
                    ]
                );
            }

            console.log("Transaction updated successfully");
        } catch (error) {
            console.error("Error updating transaction:", error);
            throw error;
        }
    }

    async exportTransactionsToExcel(): Promise<boolean> {
        try {
            // 1. Demande permission Android
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Permission de stockage',
                        message: 'L\'application a besoin d\'accéder au stockage pour enregistrer le fichier Excel.',
                        buttonNeutral: 'Plus tard',
                        buttonNegative: 'Annuler',
                        buttonPositive: 'OK',
                    }
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Permission refusée');
                    return false;
                }
            }

            // 2. Récupérer les transactions
            const transactions = await this.getTransactions();

            // 3. Créer une feuille Excel
            const ws = XLSX.utils.json_to_sheet(transactions);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

            const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

            // 4. Convertir en buffer
            const buffer = this.s2ab(wbout);

            // 5. Chemin temporaire
            const fileName = `Transactions_${Date.now()}.xlsx`;
            const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;

            // 6. Sauvegarder le fichier
            await RNFS.writeFile(path, buffer, 'ascii');
            console.log('Fichier Excel créé avec succès à :', path);
            return true
            

        } catch (err) {
            console.error('Erreur lors de l\'exportation Excel:', err);
            return false
        }
    }

    // Fonction utilitaire pour convertir en buffer ASCII
    private s2ab(s: string): string {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return String.fromCharCode.apply(null, Array.from(view));
    }

}
