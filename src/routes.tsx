import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RectButton } from "react-native-gesture-handler";
import { Alert, Animated, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import Splash from './components/splash';
import Home from './components/fixcontacts';
import Backup from './components/backupcontacts';
import CountryInfo from './components/countryinfo';
import Fixcontacts from './components/fixcontacts';

// import { createStackNavigator } from '@react-navigation/stack';


const Stack = createNativeStackNavigator();

const Routes = () => {

  function messagePopup(label: string, text: string){
    Alert.alert(label, text);
  }

  useEffect(() => {
    // messagePopup("Hello","React");
  }, []);

    return (
      <>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Splash" component={Splash}
              options={{ title: 'Contact Plus +' , 
                         headerStyle: styles.headerDefault, 
                         headerTintColor: '#FFF',
                         contentStyle: styles.contentDefault,
                          }}
            />
            <Stack.Screen name="Backup" component={Backup}
              options={{ title: 'Backup' , 
                         headerStyle: styles.headerDefault, 
                         headerTintColor: '#FFF',
                         contentStyle: styles.contentDefault,}}
            />
            <Stack.Screen name="CountryInfo" component={CountryInfo}
              options={{ title: 'Configurar País DDI' , 
                         headerStyle: styles.headerDefault, 
                         headerTintColor: '#FFF',
                         contentStyle: styles.contentDefault,}}
            />
            <Stack.Screen name="FixContacts" component={Fixcontacts}
              options={{ title: 'Corrigir Contatos +' , 
                         headerStyle: styles.headerDefault, 
                         headerTintColor: '#FFF',
                         contentStyle: styles.contentDefault,}}
            />
          </Stack.Navigator>
        </NavigationContainer>  
      </>
    );
  };
  
  const styles = StyleSheet.create({
    textDefault: {
      color: "#000",
    },
    headerDefault: {
      tintColor: '#FFF',
      fontWeight: 'bold',
      backgroundColor: '#219EBC',
      margin: '0px'
    },contentDefault: {
      // tintColor: '#FFF',
      // fontWeight: 'bold',
      backgroundColor: '#FFF',
      // margin: '0px'
    },
  });
  
  const cardStyle = {
    cardStyle: {
      backgroundColor: 'transparent',
      opacity: 1,
    },
    transitionConfig: () => ({
      containerStyle: {
        backgroundColor: 'transparent',
      },
    })
  }

  export default Routes;


