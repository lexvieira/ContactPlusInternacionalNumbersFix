import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Button,
  Alert,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { Contact } from 'react-native-contacts';
import ContactServices from '../../services/contacts';
import Navigate from '../../services/navigate';
import DefaultStyles from '../../styles/styles';
import BackupContacts from '../backupcontacts';

const STATUS_BAR_HEIGHT: number | undefined = StatusBar.currentHeight;
const SCREEN_HEIGHT: number = Dimensions.get('screen').height; // device height
console.log(`Screen Height: ${SCREEN_HEIGHT}`);
const SCREEN_WIDTH: number = Dimensions.get('screen').width;

const WINDOW_HEIGHT: number = Dimensions.get('window').height;
const NAVIGATION_BAR_HEIGHT: number =
  SCREEN_HEIGHT - (WINDOW_HEIGHT + (STATUS_BAR_HEIGHT != undefined ? STATUS_BAR_HEIGHT : 0));

export interface PhoneNumber {
  id: number;
  label: string;
  number: string;
}

const CountryInfo = ({ navigation }: any) => {
  const [countryCode, setCountryCode] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [countryDesc, setCountryDesc] = useState("");

  // console.log('SCREEN_HEIGHT: ', SCREEN_HEIGHT);
  // console.log('SCREEN_WIDTH: ', SCREEN_WIDTH);
  // console.log('WINDOW_HEIGHT: ', WINDOW_HEIGHT);
  // console.log('Status Bar Height: ', STATUS_BAR_HEIGHT);
  // console.log('Navigation Bar Height: ', NAVIGATION_BAR_HEIGHT);

  //Calc the Screen Height - (Window Height - Status Bar.)


  function renderContactsFixExample() {
    if (countryCode != "" && areaCode != "" && countryDesc != "") {
      return (
        <View style={DefaultStyles.viewColumn}>
          <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold]}>Exemplo de um contato corrigido</Text>
          <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.textBold]}>Antes: André Felix 983432233</Text>
          <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.textBold]}>Depois: André Felix ({countryDesc}) +{countryCode}{areaCode}983432233</Text>
        </View>
      )
    }
  }

  // Keyboard Over and Remove ScrollView
  return (
    <>
      {/* <View style={[{ flex: 1 }]}> */}
      <SafeAreaView style={[{ flex: 9 }]}>
        {/* <ScrollView style={[DefaultStyles.containerScreen]}> */}
        {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[{flex: 9}]}> */}
        {/* <ScrollView style={[{ flex: 1, maxHeight: Dimensions.get('screen').height }]} > */}

        <View style={[{ flex: 7 }, DefaultStyles.defaultContainer]}>
          <Text style={[DefaultStyles.textDefaultTitle]}>Corrigir Números Internacionais</Text>
          <Text style={[]}>Esse App serve para corrigir os números de Telefone sem Código Internacinal, você pode verificar na lista abaixo</Text>
          <View style={[DefaultStyles.containerVerticalSpace, DefaultStyles.viewVerticalAlignCenter]}>
            <View style={DefaultStyles.viewRow}>
              <View style={DefaultStyles.viewColumn}>
                <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold]}>Informe o código do País (Ex 55): </Text>
              </View>
              <View style={DefaultStyles.viewColumn}>
                <TextInput
                  style={[DefaultStyles.textInput]}
                  onChangeText={setCountryCode}
                  placeholder="Código do País - Ex: 55"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[{}, DefaultStyles.viewRow]}>
              <View style={DefaultStyles.viewColumn}>
                <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold]}>Informe o código da área (Ex: 11)</Text>
              </View>
              <View style={DefaultStyles.viewColumn}>
                <TextInput
                  style={[DefaultStyles.textInput]}
                  onChangeText={setAreaCode}
                  placeholder="Código Área - Ex: 11"
                  keyboardType="numeric"
                />
              </View>

            </View>
            <View style={[{}, DefaultStyles.viewRow]}>
              <View style={DefaultStyles.viewColumn}>
                <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold]}>Descrição do Contato (Ex: Fernado Gabriel (BR))</Text>
              </View>
              <View style={DefaultStyles.viewColumn}>
                <TextInput
                  style={[DefaultStyles.textInput]}
                  onChangeText={setCountryDesc}
                  placeholder="Descrição Ex: (BR)"
                  keyboardType="default"
                />
              </View>
            </View>
            <View style={[DefaultStyles.viewRow, DefaultStyles.containerVerticalSpace]}>
              {
                renderContactsFixExample()
              }
            </View>
          </View>
          {/* <View style={styles.containerVerticalSpace}>
            <BackupContacts contactsBackup={contactBackupList} />          
            </View>*/}
        </View>

        {/* </ScrollView> */}


        {/* </KeyboardAvoidingView> */}


        {/* </ScrollView> */}

        <View style={[{ flex: 2 }, DefaultStyles.defaultContainer]}>
          <View style={[DefaultStyles.containerVerticalSpace, DefaultStyles.bottomCenter]}>
            <Text style={[DefaultStyles.textDefaultInfo, DefaultStyles.marginDefautElements]}>3⁰ Clique para ver os contatos que você precisa atualizar </Text>
            <Button onPress={() => { Navigate.navigateTo(navigation, 'FixContacts', { countryCode, areaCode, countryDesc }) }} title="Verifcar Contatos" >
            </Button>
          </View>
        </View>
      </SafeAreaView>



      {/* </View> */}

    </>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    marginBottom: NAVIGATION_BAR_HEIGHT + 20,
    margin: 5,
    backgroundColor: '#FFF'
    // width: SCREEN_WIDTH,
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    color: '#000',
    backgroundColor: '#FFF',
  },
  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },
  scrollView: {
    backgroundColor: 'blue',
    // marginHorizontal: 5,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#FFF',
    padding: 5,
  },
  textDefaultTitle: {
    marginTop: 10,
    color: '#000',
    fontWeight: '900',
    fontSize: 25,
  }


});

export default CountryInfo;
