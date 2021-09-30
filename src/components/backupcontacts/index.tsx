import React from 'react';
import {Alert, Button, Text, View} from 'react-native';
// import {openDatabase} from 'react-native-sqlite-storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Contact} from 'react-native-contacts';

const BackupContacts = () => {
  //   var db = openDatabase({name: 'ContactsBackupPlus.db'});

  //   const backupContactsLocally = async (contacts: Contact) => {
  //     try {
  //       const jsonValue = JSON.stringify(contacts);
  //       await AsyncStorage.setItem('@storage_Key', jsonValue);
  //     } catch (e) {
  //       // saving error
  //     }
  //   };

  return (
    <View>
      <Text>Backup Contacts Database before Change Contacts</Text>
      <Button
        title="Click to Backup Contacts"
        onPress={() => {
          Alert.alert('Backup Contacts', 'Clicked');
        }}>
        Click to Backup
      </Button>
    </View>
  );
};

export default BackupContacts;
