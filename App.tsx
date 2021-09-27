import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Home from './src/components/home';

// import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function App() {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.textDefaultTitle}>Main Interface</Text>
      <Home />
    </View>
  );
}
//{"company": "", "department": "", "displayName": "Estagio", "emailAddresses": [], "familyName": "", "givenName": "Estagio", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": null, "phoneNumbers": [{"id": "5", "label": "home", "number": "30468237"}], "postalAddresses": [], "prefix": null, "rawContactId": "57896", "recordID": "58797", "suffix": null, "thumbnailPath": "", "urlAddresses": []}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#000',
  },
  textDefaultTitle: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '900',
    fontSize: 25,
  },
});
