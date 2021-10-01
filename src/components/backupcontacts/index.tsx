import React from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
// import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {Contact} from 'react-native-contacts';

interface Props {
  contactsBackup: Contact[];
}

const BackupContacts: React.FC<Props> = ({contactsBackup}: Props) => {
  //   var db = openDatabase({name: 'ContactsBackupPlus.db'});

  const backupContactsLocally = async (contacts: Contact[]) => {
    try {
      const contactsJsonFile = JSON.stringify(contacts);
      console.log(contacts.length);
      await AsyncStorage.setItem('@contact_Backup', contactsJsonFile);
      console.log('Success Saving File');
      Alert.alert(
        'Backup Contacts',
        `Total Contacts Backuped: ${contactsBackup.length}`,
      );
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const readContactsBackup = async () => {
    try {
      const contact_Backup_data: any = await AsyncStorage.getItem('@contact_Backup');
      const contact_Backup_list: Contact[] = null
        ? JSON.parse(contact_Backup_data)
        : null;
      contactsBackup.push(contact_Backup_list);
      Alert.alert(
        'Backup Contacts',
        `Total Contacts Backuped: ${contactsBackup.length}`,
      );
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const clearContactsBackup = async () => {
    try {
      await AsyncStorage.clear().then(console.log('Contacts Backup cleared!'));
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const removeKey = async (keyString: string) => {
    try {
      await AsyncStorage.removeItem(`@${keyString}`).then(
        console.log('Key Removed'),
      );
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  return (
    <View>
      <Text style={styles.textDefaultNormal}>
        Backup Contacts Database before Change Contacts
      </Text>
      <Text style={styles.textDefaultNormal}>
        Total Items Backuped: {`${contactsBackup.length}`}
      </Text>
      <Button
        title="Backup Contacts"
        onPress={() => {
          backupContactsLocally(contactsBackup);
        }}
      />
      <Button
        title="Read Backup Contacts"
        onPress={() => {
          readContactsBackup();
        }}
      />
      <Button
        title="Click to Remove Key Backup Contacts"
        onPress={() => {
          removeKey('storage_Key');
        }}
      />
      <Button
        title="Clear Backup"
        onPress={() => {
          clearContactsBackup();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textDefaultNormal: {
    color: '#fff',
    fontSize: 13,
  },
});

export default BackupContacts;
