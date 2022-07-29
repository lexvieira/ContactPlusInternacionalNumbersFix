import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import Routes from './src/routes';

// import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function App() {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes />    
    </>    
  );
}
//{"company": "", "department": "", "displayName": "Estagio", "emailAddresses": [], "familyName": "", "givenName": "Estagio", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": null, "phoneNumbers": [{"id": "5", "label": "home", "number": "30468237"}], "postalAddresses": [], "prefix": null, "rawContactId": "57896", "recordID": "58797", "suffix": null, "thumbnailPath": "", "urlAddresses": []}
const styles = StyleSheet.create({

});
