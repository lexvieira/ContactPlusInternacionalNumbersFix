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
} from 'react-native';
import {Contact} from 'react-native-contacts';
import ContactServices from '../../services';
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
    messagePopup("Update Contact Plust","This will all the contacts from Brazil on your phone, OK?")
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
    // let contactUpdateNumbers = contactUpdate.phoneNumbers;
    // console.log(contactUpdateNumbers.length);
    // contactUpdateNumbers.forEach((contactNumber, index) => {
    //   console.log(`${contactNumber.label} - ${contactNumber.number}`);
    //   //Remove Invalid Numbers/Notes
    //   if (contactNumber.number == contactUpdate.displayName){
    //     console.log("Invalid Number");
    //     contactUpdateNumbers.shift();
    //   } 
    // });
    // // console.log(contactUpdateNumbers);
    // contactUpdate.phoneNumbers = contactUpdateNumbers;
    // // Update the contact on the Telephone
    // ContactDeletePhone(contactList[indexContact]);
    // ContactAddNewPhone(contactUpdate);

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
    //ADD 6 LINES UP TO THE FUNCTION UPDATE CONTACTS
    //Update Contacts Estagio and Magaiver
    // if (contactPhoneNumbers[0].number !== contactPhoneNumbers[1].number){
    //     contactPhoneNumbers[0].number = contactPhoneNumbers[1].number;
    //     contactPhoneNumbers[0].label = contactPhoneNumbers[1].label;       
    // }
    // //After Update
    // console.log(contactPhoneNumbers[0]);
    // console.log(contactPhoneNumbers[1]);  
    // ContactUpdatePhone(contactInfo);
    // Remove the contact and add a new one
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
          phoneNumber.number = '+5511' + phoneNumber.number;
          // phoneNumber.label = phoneNumber.label;          
          console.log('Updated Number:' + phoneNumber.number);
          contactNeedUpdate = true;
        } else if (phoneNumber.number?.length === 9) {
          console.log('9 Digits Number: +5511' + phoneNumber.number);
          phoneNumber.number = '+5511' + phoneNumber.number;
          phoneNumber.label = phoneNumber.label;               
          contactNeedUpdate = true;
        } else if (phoneNumber.number?.length === 10) {
          if (phoneNumber.number?.substring(0, 2) !== '11') {
            phoneNumber.number = '+55' + phoneNumber.number;
            contactNeedUpdate = true;
          }
          console.log('9 Digits Number: +5511' + phoneNumber.number);
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
        phoneNumberUpdate = '+5511' + phoneNumber;
      } else if (phoneNumber.length === 9) {
        phoneNumberUpdate = '+5511' + phoneNumber;
      } else if (phoneNumber.length === 10) {
        if (phoneNumber.substring(0, 2) !== '11') {
          phoneNumberUpdate = '+55' + phoneNumber;
        }
        phoneNumberUpdate = '+5511' + phoneNumber;
      }
      phoneNumberUpdate += ' Need Update';
    } else {
      phoneNumberUpdate = phoneNumber + ' OK';
    }
    return phoneNumberUpdate;
  }

  //Simple message return to the user
  function messagePopup(label: string, text: string){
    Alert.alert(label, text,);
    // Alert.alert(
    //   "Alert Title",
    //   "My Alert Msg",
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => Alert.alert("Cancel Pressed"),
    //       style: "cancel",
    //     },
    //   ],
    //   {
    //     cancelable: true,
    //     onDismiss: () =>
    //       Alert.alert(
    //         "This alert was dismissed by tapping outside of the alert dialog."
    //       ),
    //   }
    // );
    return false; 
  }

  useEffect(() => {
    getContacts();
  }, [contactList]);

  useEffect(() => {
    console.log("Contacts " + contactList.length);    
    console.log("Backup " + contactBackupList.length);
  }, [contactBackupList]);

  return (
    <>
      <View>
        <Text style={styles.textDefaultTitle}>Contact Plus - Fix International Numbers</Text>
        <Button title='Update DDI +55 in All Brazilian Numbers' onPress={() => {updateAllContacts()}}></Button>
        <BackupContacts contactsBackup={contactBackupList} />
        <SafeAreaView style={styles.containerScroll}>
          <ScrollView style={styles.scrollView}>
            <View>
              {/* <StatusBar barStyle="light-content" /> */}
              {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
              <Text style={styles.textDefaultNormal}>
                Contacts Validation React
              </Text>
              <Text style={styles.textDefaultNormal}>
                Using React-native-contacts
              </Text>
              <Text style={styles.textDefaultNormal}>
                Platform:{' '}
                {platform !== '' ? platform.toUpperCase() : 'Unindentified'}
              </Text>
              <View>
                <Text style={styles.textDefaultNormal}>Contact Details</Text>
                <Text style={styles.textDefaultNormal}>
                  Total Contacts Registred: {totalContacts}
                </Text>
                <Text style={styles.textDefaultNormal}>
                Status Bar Height: {StatusBar.currentHeight}
                </Text>
                <Text style={styles.textDefaultNormal}>
                  Total Rerenders: {totalRerenders}
                </Text>
                {contactList?.map((contacts, index) => {
                  if (index <= 20) {
                    return (
                      <View key={String(index)}>
                        <Text style={styles.textDefaultNormal}>
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
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginBottom: NAVIGATION_BAR_HEIGHT + 20,
    // width: SCREEN_WIDTH,
  },
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    color: '#FFF',
    backgroundColor: '#000',
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
    borderColor: '#d9d9d9',
    padding: 5,    
  },
  textDefaultTitle: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '900',
    fontSize: 25,
  },
  textDefaultNormal: {
    color: '#fff',
    fontSize: 13,
  },
});

export default Home;
