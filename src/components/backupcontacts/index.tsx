import React from 'react';
import {Text, View} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const BackupContacts = () => {
  var db = openDatabase({name: 'ContactsBackupPlus.db'});


  
  return (
    <View>
      <Text>Backup Contacts Database before Change Contacts</Text>
    </View>
  );
};
