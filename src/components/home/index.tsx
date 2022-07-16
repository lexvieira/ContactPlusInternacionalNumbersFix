import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {Contact} from 'react-native-contacts';
import ContactServices from '../../services';
import DefaultStyles from '../../styles/styles';
import BackupContacts from '../backupcontacts';

const STATUS_BAR_HEIGHT: number | undefined = StatusBar.currentHeight;
const SCREEN_HEIGHT: number = Dimensions.get('screen').height; // device height
const SCREEN_WIDTH: number = Dimensions.get('screen').width;

const WINDOW_HEIGHT: number = Dimensions.get('window').height;
const NAVIGATION_BAR_HEIGHT: number =
  SCREEN_HEIGHT - (WINDOW_HEIGHT + (STATUS_BAR_HEIGHT != undefined? STATUS_BAR_HEIGHT : 0));

export interface PhoneNumber {
    id: number;
    label: string;
    number: string;
}

const Home = () => {
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contactBackupList, setContactBackupList] = useState<Contact[]>([]);

  const [countryCode, setCountryCode] = useState("");
  const [areaCode, setAreaCode] = useState("");  
  // const [firstContact, setFirstContact] = useState<Contact[]>();
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalRerenders, setTotalRerenders] = useState(0);

  // console.log('SCREEN_HEIGHT: ', SCREEN_HEIGHT);
  // console.log('SCREEN_WIDTH: ', SCREEN_WIDTH);
  // console.log('WINDOW_HEIGHT: ', WINDOW_HEIGHT);
  // console.log('Status Bar Height: ', STATUS_BAR_HEIGHT);
  // console.log('Navigation Bar Height: ', NAVIGATION_BAR_HEIGHT);

  //Calc the Screen Height - (Window Height - Status Bar.)

  const platform = Platform.OS.toString();

  function getContacts() {
    if (platform === 'ios') {
      ContactServices.getAll()
        .then(contacts => {
          setContactList(contacts);
          // Check Backup Contacts
          // console.log(contacts[1]);
        })
        .catch(err => {
          if (err) {
            throw err;
          }
        });
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'We need your permission to access your contacts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }).then(() => {
        ContactServices.getAll()
          .then(contacts => {
            setContactList(contacts);
            setTotalContacts(contacts.length);

          })
          .catch(err => {
            if (err) {
              throw err;
            }
          });
      });
    }
  }

  function updateAllContacts(){
    messagePopupWithCancel("Update Contact Plust","This will all the contacts from Brazil on your phone, OK?","Cancel","Cancel Update");
    let allContacts = contactList;
    allContacts.forEach((contact, index) => {
      updateContactsInternationalCode(contact);
    });
  }

  function updateSingle(indexContact: number){
    // console.log(typeof(indexContact));
    // console.log(contactList[indexContact]);
    let contactUpdate:Contact;
    contactUpdate = contactList[indexContact];
    messagePopup("Contact Update Manually", contactUpdate.displayName);
    updateContactsInternationalCode(contactUpdate);
  }

  function fixContactInfo(contact: Contact){
    let contactInfo = contact;
    let contactPhoneNumbers = contactInfo.phoneNumbers;
    let contactNeedUpdate = false; 
    //Before Update
    console.log(contactPhoneNumbers[0]);
    console.log(contactPhoneNumbers[1]);
    let contactNumber = contactPhoneNumbers[1];
    let contaNumberLength = contactPhoneNumbers.length;
    contactPhoneNumbers = [];
    contactPhoneNumbers.push(contactNumber);
    contactInfo.phoneNumbers = contactPhoneNumbers;
    contactInfo.givenName = contactInfo.givenName + " (BR)";
    ContactDeletePhone(contact);
    ContactAddNewPhone(contactInfo);
  }

  //Fix the international codes from Brazil
  function updateContactsInternationalCode(contact: Contact) {
    let contactInfo = contact;
    let contactPhoneNumbers = contactInfo.phoneNumbers;
    let contactNeedUpdate = false;

    //Verify Phone Numbers
    contactPhoneNumbers.forEach((phoneNumber, index) => {
      if (phoneNumber.number == contactInfo.displayName){
        console.log("Invalid Number");
        contactPhoneNumbers.shift();
      }else if (phoneNumber.number?.substring(0, 1) !== '+') {
        if (phoneNumber.number?.length === 8) {
          console.log('PhoneID:' + contactInfo.recordID);
          console.log('Old Number: ' + phoneNumber.number);
          phoneNumber.number = `+${countryCode}${areaCode}` + phoneNumber.number;
          // phoneNumber.label = phoneNumber.label;          
          console.log('Updated Number:' + phoneNumber.number);
          contactNeedUpdate = true;
        } else if (phoneNumber.number?.length === 9) {
          console.log(`9 Digits Number:+${countryCode}${areaCode}`+ phoneNumber.number);
          phoneNumber.number = `+${countryCode}${areaCode}` + phoneNumber.number;
          phoneNumber.label = phoneNumber.label;               
          contactNeedUpdate = true;
        } else if (phoneNumber.number?.length === 10) {
          if (phoneNumber.number?.substring(0, 2) !== `${areaCode}`) {
            phoneNumber.number = `+${countryCode}` + phoneNumber.number;
            contactNeedUpdate = true;
          }
          console.log(`9 Digits Number:+${countryCode}${areaCode}`+ phoneNumber.number);
        }
      }
    });

    console.log(contactPhoneNumbers);

    console.log('Update Contact on Telephone');
    contactInfo.phoneNumbers = contactPhoneNumbers;
    console.log(contactInfo);
    if (contactNeedUpdate) {
      contactInfo.givenName = contactInfo.givenName + " (BR)";
      ContactDeletePhone(contact); 
      ContactAddNewPhone(contactInfo);

       //ContactUpdatePhone(contactInfo);
    }
  }

  //Function to Create a New Contact on the Phone
  function ContactAddNewPhone(Contact: Contact){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Contacts Write Permissions',
        message: 'We need your permission to Write on your contacts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(async () => {
      let contactUpdateValidation = await ContactServices.addContact(Contact);
      if (contactUpdateValidation.status === true) {
        console.log('Contact Updated Sucessfully');
      }
    });   
  }

 //Function to Delete The Contact on the Phone, must be done befere include a new one, once the update is not working
  function ContactDeletePhone(Contact: Contact){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Contacts Write Permissions',
        message: 'We need your permission to Write on your contacts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(async () => {
      let contactUpdateValidation = await ContactServices.deleteContact(Contact);
      if (contactUpdateValidation.status === true) {
        console.log('Contact Updated Sucessfully');
      }
    });   
  } 

  //Not working - Platform issues
  function ContactUpdatePhone(Contact: Contact){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      {
        title: 'Contacts Write Permissions',
        message: 'We need your permission to Write on your contacts',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    ).then(async () => {
      let contactUpdateValidation = await ContactServices.updateContact(Contact);
      if (contactUpdateValidation.status === true) {
        console.log('Contact Updated Sucessfully');
      }
    });   
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

   
  // function onChangeCountryCode(){
  //   setCountryCode(countryCode)
  // }
  // function onChangeAreaCode(){
  //   console.log(`New Area Code: ${areaCode}`);
  // }


  //Simple message return to the user
  function messagePopup(label: string, text: string){
    Alert.alert(label, text);
  }

  function messagePopupWithCancel(labelAlert: string, textAlert: string, labelCancel: string, textCancel: string){
      let messageReturn: boolean = true;
      Alert.alert(
        labelAlert,
        textAlert,
        [
          {
            text: "Cancel",
            onPress: () => {
              Alert.alert(
                labelCancel,
                textCancel,
              );
              messageReturn = false;
              },
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    return messageReturn; 
  }

  useEffect(() => {
    getContacts();
  }, [contactList]);

  useEffect(() => {
    console.log("Contacts " + contactList.length);    
    console.log("Backup " + contactBackupList.length);
  }, [contactBackupList]);

  return (
    <SafeAreaView style={styles.containerScroll}>
      <View>
        <Text style={[DefaultStyles.textDefaultTitle]}>Corrigir Números Internacionais</Text>
        <View style={[DefaultStyles.containerVerticalSpace, DefaultStyles.viewAlignOnTop]}>
          <View style={DefaultStyles.viewRow}>
            <View style={DefaultStyles.viewColumn}>
              <Text style={[DefaultStyles.labelDefaultNormal,DefaultStyles.textBold]}>Informe o código do País (Exemplo 55): </Text>
            </View>
          </View>
          <View style={DefaultStyles.viewRow}>
            <View style={DefaultStyles.viewColumn}>
              <TextInput
                  style={[DefaultStyles.textInput]}
                  onChangeText={setCountryCode}
                  placeholder="Código do País - Ex: 55"
                  keyboardType="numeric"        
                />
            </View>
          </View>
          <View style={[{},DefaultStyles.viewRow]}>
            <View style={DefaultStyles.viewColumn}>
              <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold]}>Informe o código da área (Exemplo 11)</Text>
            </View>
          </View>
          <View style={[,DefaultStyles.viewRow]}>
            <View style={DefaultStyles.viewColumn}>
              <TextInput
                style={[DefaultStyles.textInput]}
                onChangeText={setAreaCode}
                placeholder="Código Área - Ex: 11"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={[{},DefaultStyles.viewRow]}>
            <View style={DefaultStyles.viewColumn}>
              <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold]}>Descrição do Contato (Exemplo Fernado Gabriel (BR))</Text>
            </View>
          </View>
          <View style={[,DefaultStyles.viewRow]}>
            <View style={DefaultStyles.viewColumn}>
              <TextInput
                style={[DefaultStyles.textInput]}
                onChangeText={setAreaCode}
                placeholder="Descrição Ex: (BR)"
                keyboardType="default"
              />
            </View>
          </View>

          <View style={[DefaultStyles.viewRow, DefaultStyles.containerVerticalSpace]}>
            <View style={DefaultStyles.viewColumn}>
              <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.textBold]}>Código País: "+" {countryCode} - Código Área: {areaCode} </Text>
            </View>
          </View>
        </View>

        <View style={DefaultStyles.containerVerticalSpace}>

          <View style={DefaultStyles.viewRow}>
            <View style={DefaultStyles.viewColumn}>
              <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.textBold]}>Pressione para atualizar todos os contatos</Text>
            </View>
            <View style={DefaultStyles.viewColumn}>
              <Button title='Atualizar' onPress={() => {updateAllContacts()}}></Button>
            </View>
          </View>
        </View>

        {/* <View style={styles.containerVerticalSpace}>
         <BackupContacts contactsBackup={contactBackupList} />          
        </View>
  */}
          <ScrollView style={[]}>
            <View>
              {/* <StatusBar barStyle="light-content" /> */}
              {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
              <Text style={DefaultStyles.textDefaultNormal}>
                Contacts Validation React
              </Text>
              <Text style={DefaultStyles.textDefaultNormal}>
                Using React-native-contacts
              </Text>
              <Text style={DefaultStyles.textDefaultNormal}>
                Platform:{' '}
                {platform !== '' ? platform.toUpperCase() : 'Unindentified'}
              </Text>
              <View>
                <Text style={DefaultStyles.textDefaultNormal}>Contact Details</Text>
                <Text style={DefaultStyles.textDefaultNormal}>
                  Total Contacts Registred: {totalContacts}
                </Text>
                <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.hideComponents]}>
                Status Bar Height: {StatusBar.currentHeight}
                </Text>
                <Text style={DefaultStyles.textDefaultNormal}>
                  Total Rerenders: {totalRerenders}
                </Text>
                {contactList?.map((contacts, index) => {
                  if (index <= 20) {
                    return (
                      <View key={String(index)}>
                        <Text style={DefaultStyles.textDefaultNormal}>
                          {contacts.givenName}
                        </Text>
                        {contacts.phoneNumbers.map((phoneNumber: any, indexPhoneNumber) => {
                            return (
                              <View key={String(indexPhoneNumber)}>
                                <Text>
                                  id:{`${phoneNumber.id}`} - Number(
                                  {`${phoneNumber.label}): `}
                                  {phoneNumber.number}
                                  {`\nStatus: - ${verifyContactsInternationalCode(
                                    phoneNumber.number,
                                  )}`}
                                </Text>
                                {
                                  verifyContactsInternationalCode(
                                    phoneNumber.number,
                                  ).includes("Need Update") == true ? 
                                    <Button key={String(phoneNumber.id)} title='Update' onPress={() => {updateSingle(indexPhoneNumber)}}></Button>
                                    : null
                                }
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
            </View>
          </ScrollView>

      </View>
    </SafeAreaView>
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

export default Home;
