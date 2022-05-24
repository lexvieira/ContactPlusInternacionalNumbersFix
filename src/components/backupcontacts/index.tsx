import React, { useEffect, useState } from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
// import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {Contact} from 'react-native-contacts';

interface Props {
  contactsBackup: Contact[];
}

const BackupContacts: React.FC<Props> = ({contactsBackup}: Props) => {
  //   var db = openDatabase({name: 'ContactsBackupPlus.db'});

  const [backupExist, setBackupExist] = useState(false);
  const [totalContacts, setTotalContacts] = useState(0);
  const [backupContacts, setbackupContacts] = useState<Contact[]>([]);

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
      const contact_Backup_data: any = await AsyncStorage.getItem(
        '@contact_Backup',
      );
      contactsBackup = JSON.parse(contact_Backup_data);
      Alert.alert(
        'Backup Contacts (Recovered)',
        `Total Contacts Loaded: ${contactsBackup.length}`,
      );
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const clearContactsBackup = async () => {
    try {
      await AsyncStorage.clear().then(() => {
        console.log('Contacts Backup cleared!');
      });
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const removeKey = async (keyString: string) => {
    try {
      await AsyncStorage.removeItem(`@${keyString}`);
      console.log(`Key ${keyString} Removed`)            
      return true;
    } catch (e) {
      console.log(`Error Removing Backup ${keyString}: ${e}`);
    }
  };


  const checkBackup = async() => {
    const contact_Backup_data: any = await AsyncStorage.getItem(
      '@contact_Backup',
    );
    
    if (!contact_Backup_data){
      console.log("No Backup Active");
      //backupContactsLocally(contactsBackup);
    }else{
      setBackupExist(true);
      setTotalContacts(JSON.parse(contact_Backup_data).length);
      setbackupContacts(JSON.parse(contact_Backup_data));
    }
  }

  useEffect(() => {
    // checkBackup();
  }, [backupExist,totalContacts,backupContacts]);

  return (
    <View style={styles.backupView}>
      <Text style={styles.textDefaultNormal}>
        Backup Contacts Database before Change Contacts
      </Text>
      <Text style={styles.textDefaultNormal}>
        Backup contacts save:{' '}
        {backupExist
          ? 'YES, Total Contacts: ' + totalContacts
          : 'No Backup Active'}
      </Text>
      <Button
        title="Backup Contacts"
        onPress={() => {
          backupContactsLocally(contactsBackup);
        }}
      />
      <Text style={styles.textDefaultNormal}>Load existent Backup</Text>
      <Button
        title="Read Backup Contacts"
        onPress={() => {
          readContactsBackup();
        }}
      />
      <Text style={styles.textDefaultNormal}>
        Remove a existent key from the backup (Insert Key Name)
      </Text>
      <Button
        title="Click to Remove Key Backup Contacts"
        onPress={() => {
          removeKey('storage_Key');
        }}
      />
      <Text style={styles.textDefaultNormal}>Clear existents Backups</Text>
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
    color: '#FFF',
    fontSize: 13,
  },
  backupView: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#d9d9d9',
    padding: 5,
  }
});

export default BackupContacts;
