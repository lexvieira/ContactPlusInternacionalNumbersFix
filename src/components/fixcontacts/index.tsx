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
import backupService from '../../services/backupService';
import ContactServices from '../../services/contacts';
import msgService from '../../services/msgService';
import DefaultStyles from '../../styles/styles';
import BackupContacts from '../backupcontacts';
import Example from '../example';
import utils, { countryDetails } from '../../services/utils';
import area_br from '../../data/codearelist';

const STATUS_BAR_HEIGHT: number | undefined = StatusBar.currentHeight;
const SCREEN_HEIGHT: number = Dimensions.get('screen').height; // device height
// console.log(`Screen Height: ${SCREEN_HEIGHT}`);
const SCREEN_WIDTH: number = Dimensions.get('screen').width;

const WINDOW_HEIGHT: number = Dimensions.get('window').height;
const NAVIGATION_BAR_HEIGHT: number =
  SCREEN_HEIGHT - (WINDOW_HEIGHT + (STATUS_BAR_HEIGHT != undefined ? STATUS_BAR_HEIGHT : 0));

export interface PhoneNumber {
  id: number;
  label: string;
  number: string;
}

const Fixcontacts = ({ route, navigation }: any) => {
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contactBackupList, setContactBackupList] = useState<Contact[]>([]);
  const [updateContactListView, setUpdateContactListView] = useState(false);
  // const [areaCodeState, setAreaCodeState] = useState("");

  // const [countryCode, setCountryCode] = useState("");
  // const [areaCode, setAreaCode] = useState("");
  // const [countryDesc, setCountryDesc] = useState("");

  // const [firstContact, setFirstContact] = useState<Contact[]>();
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalRerenders, setTotalRerenders] = useState(0);

  const paramContact = route.params.parameters;

  const countryCode = paramContact.countryCode;
  const areaCode = paramContact.areaCode;
  const countryDesc = paramContact.countryDesc;

  const STORAGE_KEY_CONTACTS_BACKUP = backupService.STORAGE_KEY_CONTACTS_BACKUP;
  const STORAGE_KEY_CONTACTS_BACKUP_DATETIME = backupService.STORAGE_KEY_CONTACTS_BACKUP_DATETIME;

  //Backup State
  const [backupContacts, setBackupContacts] = useState<Contact[]>([]);
  // setCountryCode(paramContact.countryCode);
  // setAreaCode(route.areaCode);
  // setCountryDesc(route.countryDesc);

  // Checking the Screen Dimensions
  // console.log('SCREEN_HEIGHT: ', SCREEN_HEIGHT);
  // console.log('SCREEN_WIDTH: ', SCREEN_WIDTH);
  // console.log('WINDOW_HEIGHT: ', WINDOW_HEIGHT);
  // console.log('Status Bar Height: ', STATUS_BAR_HEIGHT);
  // console.log('Navigation Bar Height: ', NAVIGATION_BAR_HEIGHT);

  //Calc the Screen Height - (Window Height - Status Bar.)

  const platform = Platform.OS.toString();

  function getContacts() {

    ContactServices.getAllContacts()
      .then(contacts => {
        setContactList(contacts);
        setTotalContacts(contacts.length);
        // Checking Contacts Backup
        // checkBackup(); 
      })
      .catch(err => {
        if (err) {
          throw err;
        }
      });

  }

  async function updateAllContacts() {
    //Fix Returns
    await msgService.messagePopupWithCancel("Atualizar Contatos", "Você irá atualizar todos os contatos do seu telefone com o código internacional, OK?", "Confirmar", "Cancelar").then((confirmUpdateAll) => {
      if (confirmUpdateAll){
        let allContacts = contactList;
        allContacts.forEach((contact, index) => {
          updateContactsInternationalCode(contact);
        });        
      }
    });

  }

  function updateSingle(contact: Contact, indexContactNumber: number) {
    let contactUpdate: Contact;
    msgService.messagePopup("Contact Update Manually", contact.displayName);
    updateContactsInternationalCode(contact);
  }

  //Fix the international codes from Brazil
  function updateSingleContactsInternationalCode(contact: Contact, indexContactNumber: number) {
    let contactInfo = contact;
    let contactPhoneNumbers = contactInfo.phoneNumbers;
    let contactNeedUpdate = false;
    //Fix Contact Numbers based on the rules in the function numberPhoneRules()
    contactPhoneNumbers.forEach((phoneNumber, index) => {
      if (index == indexContactNumber) {
        if (phoneNumber.number?.substring(0, 1) !== '+') {
          contactNeedUpdate = true;
          let phoneNumberFixed = numberPhoneRules(phoneNumber.number);
          phoneNumber.number = phoneNumberFixed.phoneNumberUpdate;
        }
      }
    });

    // Update Contacts in the Phone 
    // console.log('Update Contact on Telephone');
    contactInfo.phoneNumbers = contactPhoneNumbers;
    // console.log(contactInfo);
    if (contactNeedUpdate) {
      contactInfo.givenName = contactInfo.givenName + " ${countryDesc}";

      // Verifying if Bug about Update Contact with React Native was solved 
      // Bug React Native Solved, not necessary Delete and Add a new one
      // ContactDeletePhone(contact);
      // ContactAddNewPhone(contactInfo);
      ContactUpdatePhone(contactInfo).then(() => {
        msgService.messagePopup("Atualizar Contatos", "Contato Atualizado com Sucesso");
        setUpdateContactListView(true);
      });
    }
  }

  //Fix the international codes from Brazil
  function updateContactsInternationalCode(contact: Contact) {
    let contactInfo = contact;
    let contactPhoneNumbers = contactInfo.phoneNumbers;
    let contactNeedUpdate = false;
    //Fix Contact Numbers based on the rules in the function numberPhoneRules()
    contactPhoneNumbers.forEach((phoneNumber, index) => {
      if (phoneNumber.number == contactInfo.displayName) {
        // console.log("Invalid Number");
        contactPhoneNumbers.shift();
      } else if (phoneNumber.number?.substring(0, 1) !== '+') {
        // console.log('PhoneID:' + contactInfo.recordID);
        // console.log('Old Number: ' + phoneNumber.number);
        contactNeedUpdate = true;
        let phoneNumberFixed = numberPhoneRules(phoneNumber.number);
        phoneNumber.number = phoneNumberFixed.phoneNumberUpdate;
      }
    });

    // Update Contacts in the Phone 
    // console.log('Update Contact on Telephone');
    contactInfo.phoneNumbers = contactPhoneNumbers;
    // console.log(contactInfo);
    if (contactNeedUpdate) {
      contactInfo.givenName = contactInfo.givenName + ` ${countryDesc}`;
      // ContactDeletePhone(contact);
      // ContactAddNewPhone(contactInfo);

      ContactUpdatePhone(contactInfo).then(() => {
        msgService.messagePopup("Atualizar Contatos", "Contato Atualizado com Sucesso");
      });
    }
  }

  //Function to Create a New Contact on the Phone
  async function ContactAddNewPhone(Contact: Contact) {
    let contactUpdateValidation = await ContactServices.addContact(Contact);
    if (contactUpdateValidation.status === true) {
      // console.log('Contact Updated Sucessfully');
    }
  }

  //Function to Delete The Contact on the Phone, must be done befere include a new one, once the update is not working
  //Check Again, Update looks to be working right now
  async function ContactDeletePhone(Contact: Contact) {
    let contactUpdateValidation = await ContactServices.deleteContact(Contact);
    if (contactUpdateValidation.status === true) {
      msgService.messagePopup("Contato Atualizado", "Contato Deletado com Sucesso")
    }
  }

  //Not working - Platform issues
  async function ContactUpdatePhone(Contact: Contact) {
    let contactUpdateValidation = await ContactServices.updateContact(Contact);
    if (contactUpdateValidation.status === true) {
      msgService.messagePopup("Contato Atualizado", "Contato Atualizado com Sucesso")
    }
  }

  function numberPhoneRules(phoneNumber: string) {
    let areaCodePhone: any = '';
    let phoneNumberUpdate = '';
    if (phoneNumber.length === 8) { //Rule 1 -> Brazilian Rule, can't include the digit 9, once local numbers don't use that.
      phoneNumberUpdate = `+${countryCode}${areaCode}${phoneNumber}`;
    } else if (phoneNumber.length === 9 && !phoneNumber.includes("-")) { //Rule 2 -> Check if phone number there is 9 digits and no "- dash in the middle"
      phoneNumberUpdate = `+${countryCode}${areaCode}${phoneNumber}`;
    } else if (phoneNumber.length >= 10) { //Rule 3 -> Check if the number has the area code, if yes include just the country code
      areaCodePhone = utils.filterAreaBR(parseInt(phoneNumber.substring(0, 2)))
      if (phoneNumber.substring(0, 2) == areaCode || areaCodePhone != "") { //Rule 3.1 -> Check similar area codes
        phoneNumberUpdate = `+${countryCode}${phoneNumber}`;
      } else {
        phoneNumberUpdate = `+${countryCode}${areaCode}${phoneNumber}`;
      }
    }
    return { phoneNumberUpdate, areaCodePhone }
  }

  //Verify Contacts to Update follow the rules in the function numberPhoneRules()
  function verifyContactsToUpdate(Contact: Contact) {
    let needUpdate: boolean = false;
    let numberUpdates: any = {};
    numberUpdates.numbers = [];
    let phoneNumberUpdate = '';
    let areaCodePhone: any = '';
    Contact.phoneNumbers.forEach((phoneNumber, indexPhoneNumber) => {
      if (phoneNumber.number.substring(0, 1) !== '+') {
        let numberUpdate = numberPhoneRules(phoneNumber.number);
        areaCodePhone = numberUpdate.areaCodePhone;
        phoneNumberUpdate = numberUpdate.phoneNumberUpdate;
        needUpdate = true;
        numberUpdates.needUpdate = needUpdate;
        numberUpdates.numbers.push({ needUpdate: needUpdate, phonenumber: phoneNumberUpdate, indexPhoneNumber: indexPhoneNumber, areaCodePhone: areaCodePhone });
      } else {
        numberUpdates.numbers.push({ needUpdate: false, phonenumber: phoneNumberUpdate, indexPhoneNumber: indexPhoneNumber, areaCodePhone: areaCodePhone });
      }
      needUpdate = false;
      areaCodePhone = '';
    })
    return numberUpdates;
  }

  //Verify the phone numbers to display on the App
  function verifyContactsInternationalCode(phoneNumber: string) {
    //ADD RETURN TRUE FALSE TELLING IF NEED TO UPDATE OR NOT
    //CREATE UNIQUE FUNCTION TO FIX THE CONTACTS
    let phoneNumberUpdate = '';

    if (phoneNumber.substring(0, 1) !== '+') {
      if (phoneNumber.length === 8) {
        phoneNumberUpdate = `+${countryCode}${areaCode}` + phoneNumber;
      } else if (phoneNumber.length === 9) {
        phoneNumberUpdate = `+${countryCode}${areaCode}` + phoneNumber;
      } else if (phoneNumber.length === 10) {
        if (phoneNumber.substring(0, 2) !== areaCode) {
          phoneNumberUpdate = `+${countryCode}` + phoneNumber;
        }
        phoneNumberUpdate = `+${countryCode}${areaCode}` + phoneNumber;
      }
      phoneNumberUpdate += ' Need Update';
    } else {
      phoneNumberUpdate = phoneNumber + ' OK';
    }
    return phoneNumberUpdate;
  }

  //#region Read And Recovering Backup

  // const readContactsBackup = async () => {
  //   try {
  //     await backupService.readContactsBackup(STORAGE_KEY_CONTACTS_BACKUP).then((contactBackup) => {
  //       console.log(contactBackup.length);
  //       setBackupContacts(contactBackup);
  //     });
  //   }
  //   catch (e) {
  //     console.log(e);
  //     msgService.messagePopup(
  //       'Falha ao ler o Backup',
  //       `Não foi possível ler o backup, você pode executar um novo backup antes de corrigir os contatos, Service: ReadContactsBackup`,
  //     );
  //   }
  // }

  const readContactsBackup = async () => {
    try {
      await backupService.readContactsBackup(STORAGE_KEY_CONTACTS_BACKUP).then((contacts) => {
        setBackupContacts(contacts);
      });
    }
    catch (e) {
      // console.log(e);
      msgService.messagePopup(
        'Falha ao ler o Backup',
        `Não foi possível ler o backup, você pode executar um novo backup antes de corrigir os contatos`,
      );
    }
  };

  async function restoreContactsBackup() {
    // console.log(`Total Backup Contacts: ${backupContacts.length}`);
    if (backupContacts.length > 0) {
      // console.log(`Total Backup Contacts: ${backupContacts.length}`);
      await msgService.messagePopupWithCancel(
        'Backup lido com sucesso, Restaurar?,',
        `Total Contacts Loaded: ${backupContacts != null ? backupContacts.length : 0}\n Você deseja continuar com a Restauração dos Contatos?`,
        'Confirmar',
        'Cancelar',
      ).then((confirmRestore) => {
        if (confirmRestore) {
          // console.log(backupContacts.length);
          //Erasing Contacts to Restore
          contactList.forEach((contact) => {
            ContactDeletePhone(contact);
          });
          //Restoring Contacts
          backupContacts.forEach((contact) => {
            ContactAddNewPhone(contact);
          });
          msgService.messagePopup("Restaurar Contatos", "Concluído com sucesso").then((confirm) => {
            // console.log("Contacts Restored");
          });
        } else {
          // console.log("Cancelled");
        }
        // if (confirmRestore) {
        //   contactBackup.forEach((contact, index) => {
        //     console.log("Finish")
        //   });        
      });

    }


  }


  // function RupdateAllContacts() {
  //   msgService.messagePopupWithCancel("Update Contact Plust", "This will all the contacts from Brazil on your phone, OK?", "Cancel", "Cancel Update");
  //   let allContacts = contactList;
  //   allContacts.forEach((contact, index) => {
  //     updateContactsInternationalCode(contact);
  //   });
  // }

  //#endregion

  //Utils
  // function getAreaBr(area_code: number) {
  //   console.log("Area Func " + area_code)
  //   let areaBR = utils.filterAreaBR(area_code);
  //   console.log(`Area1 Time 1: ${areaBR}`);
  //   return areaBR;
  // }  

  useEffect(() => {
    getContacts();
  }, [contactList]);


  useEffect(() => {
    readContactsBackup();
  }, []);
  // useEffect(() => {
  //   // console.log("Contacts " + contactList.length);
  //   // console.log("Backup " + contactBackupList.length);
  // }, [contactBackupList]);

  //barStyle={isDarkMode ? 'light-content' : 'dark-content'
  // {platform !== '' ? platform.toUpperCase() : 'Unindentified'}
  function renderContactsFix() {
    if (countryCode != "" && areaCode != "" && countryDesc != "") {

      return (
        <View style={[{ marginBottom: 15 }]}>
          {contactList?.map((contact, indexContact) => {
            let verifyContact = verifyContactsToUpdate(contact);

            // console.log(verifyContact);
            if (contact.phoneNumbers.length > 0 && indexContact <= 50) {
              return (
                <View key={String(indexContact)} >
                  <View style={[DefaultStyles.viewRow]}>
                    <View style={[DefaultStyles.viewColumn]}>
                      <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.viewRowTitle]}>
                        Antigo: {contact.givenName}{verifyContact.needUpdate ? ` >> Novo: ${contact.givenName} (${countryDesc})` : null}
                      </Text>
                    </View>
                  </View>
                  {contact.phoneNumbers.map((phoneNumber: any, indexPhoneNumber) => {
                    return (
                      <View key={String(indexPhoneNumber)} style={[DefaultStyles.viewRow, DefaultStyles.viewRowBorder]}>
                        <View style={[DefaultStyles.viewRow]}>
                          <View style={[DefaultStyles.viewColumn]}>
                            <Text>
                              id:{`${phoneNumber.id}`} {`(${phoneNumber.label}): `}
                              {`${verifyContact.numbers[indexPhoneNumber].areaCodePhone}`} {phoneNumber.number}
                            </Text>
                            <Text style={[DefaultStyles.textBold, verifyContact.numbers[indexPhoneNumber].needUpdate == false ? DefaultStyles.hideComponents : null]}>
                              {`${verifyContact.numbers[indexPhoneNumber].needUpdate ? `Precisa Atualizar: ${verifyContact.numbers[indexPhoneNumber].phonenumber}` : ''}`}
                            </Text>
                          </View>
                          {
                            verifyContact.numbers[indexPhoneNumber].needUpdate == true ?
                              <View key={String(phoneNumber.id)} style={[DefaultStyles.viewRow]}>
                                <Button title='Atualizar' onPress={() => { updateSingleContactsInternationalCode(contact, indexPhoneNumber) }}></Button>
                              </View>
                              : null
                          }
                        </View>
                      </View>
                    );
                  },
                  )}

                </View>

              );
            }
          })}
          {/* <Text>Name: {firstContact.givenName} </Text>
            <Text>Name: {firstContact.familyName} </Text>
            <Text>Phone Number: {firstContact.phoneNumbers[0].number} </Text>
            <Text>Name: {firstContact.recordID} </Text> */}
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
          <Text style={[]}>Agora você pode verificar os números que precisam ser corrigidos ou atualizar todos de uma só vez ou um por um, Você decide 😉</Text>
          <View style={[DefaultStyles.viewRow, DefaultStyles.containerVerticalSpace]}>
            <Example contactsExample={{ countryCode, areaCode, countryDesc }} />
          </View>
          <View style={[DefaultStyles.viewRow, DefaultStyles.containerVerticalSpace]}>
            <View style={DefaultStyles.viewColumn}>
              <Text style={[]}>Caso precise, você pode restaurar seus contatos a partir do seu backup.</Text>
            </View>
          </View>
          <View>
            <Text style={DefaultStyles.textDefaultInfo}>Detalhes dos Contatos - (Total: {totalContacts})</Text>
            <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.hideComponents]}>
              Status Bar Height: {StatusBar.currentHeight}
            </Text>
          </View>
          {/* </View> */}
          {/* <View style={styles.containerVerticalSpace}>
            <BackupContacts contactsBackup={contactBackupList} />          
            </View>*/}
          {/* <View style={[{ flex: 5 }, DefaultStyles.defaultContainer]}> */}
          <ScrollView style={[{}, DefaultStyles.ScrollBox, DefaultStyles.borderRadiosDefault]}>
            {
              renderContactsFix()
            }
          </ScrollView>
        </View>

        {/* </ScrollView> */}


        {/* </KeyboardAvoidingView> */}


        {/* </ScrollView> */}
        <View style={[{ flex: 1 }, DefaultStyles.defaultContainer]}>
          <View style={[DefaultStyles.bottomCenter]}>
            <Text style={[DefaultStyles.textDefaultInfo, DefaultStyles.textAlignCenter]}>3⁰ Atualize ou recupere todos os contatos</Text>
            <View style={[DefaultStyles.viewRow]}>
              <View style={[DefaultStyles.viewColumn, DefaultStyles.bottomCenter, DefaultStyles.buttonDefault]}>
                <Button title='Atualizar Todos' onPress={() => { updateAllContacts() }}></Button>
              </View>
              <View style={[DefaultStyles.viewColumn, DefaultStyles.bottomCenter, DefaultStyles.buttonDefault]}>
                {/* <Text style={[DefaultStyles.textDefaultInfo]}>Restaurar Contatos</Text> */}
                <Button title='Recuperar Backup' onPress={() => { restoreContactsBackup() }}></Button>
              </View>
            </View>
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

export default Fixcontacts;