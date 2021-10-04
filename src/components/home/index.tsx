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
} from 'react-native';
import {Contact} from 'react-native-contacts';
import ContactServices from '../../services';
import BackupContacts from '../backupcontacts';

const STATUS_BAR_HEIGHT: number = StatusBar.currentHeight;
const SCREEN_HEIGHT: number = Dimensions.get('screen').height; // device height
const SCREEN_WIDTH: number = Dimensions.get('screen').width;

const WINDOW_HEIGHT: number = Dimensions.get('window').height;
const NAVIGATION_BAR_HEIGHT: number =
  SCREEN_HEIGHT - (WINDOW_HEIGHT + STATUS_BAR_HEIGHT);


const Home = () => {
  const [contactList, setContactList] = useState<Contact[]>();
  // const [firstContact, setFirstContact] = useState<Contact[]>();
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalRerenders, setTotalRerenders] = useState(0);

  console.log('SCREEN_HEIGHT: ', SCREEN_HEIGHT);
  console.log('SCREEN_WIDTH: ', SCREEN_WIDTH);
  console.log('WINDOW_HEIGHT: ', WINDOW_HEIGHT);
  console.log('Status Bar Height: ', STATUS_BAR_HEIGHT);
  console.log('Navigation Bar Height: ', NAVIGATION_BAR_HEIGHT);

  //Calc the Screen Height - (Window Height - Status Bar.)

  const platform = Platform.OS.toString();

  function getContacts() {
    if (platform === 'ios') {
      ContactServices.getAll()
        .then(contacts => {
          setContactList(contacts);
          console.log(contacts[0]);
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
            console.log(contacts[0]);
            setTotalRerenders(totalRerenders + 1);
            // if (contacts[0].phoneNumbers.number[0]?.substring(0, 1) !== '+') {
            //   //updateContactsInternationalCode(contacts[0]);
            // }
          })
          .catch(err => {
            if (err) {
              throw err;
            }
          });
      });
    }
  }

  function updateContactsInternationalCode(contact: Contact) {
    let contactInfo = contact;
    let contactPhoneNumbers = contactInfo.phoneNumbers;
    let contactNeedUpdate = false;
    contactPhoneNumbers.map((phoneNumber, index) => {
      if (phoneNumber.number?.substring(0, 1) !== '+') {
        if (phoneNumber.number?.length === 8) {
          console.log('PhoneID:' + contactInfo.recordID);
          console.log('Old Number: ' + phoneNumber.number);
          phoneNumber.number = '+5511' + phoneNumber.number;
          console.log('Updated Number:' + phoneNumber.number);
          contactNeedUpdate = true;
        } else if (phoneNumber.number?.length === 9) {
          console.log('9 Digits Number: +5511' + phoneNumber.number);
          contactNeedUpdate = true;
        } else if (phoneNumber.number?.length === 10) {
          if (phoneNumber.number?.substring(0, 2) !== '11') {
            phoneNumber.number = '+55' + phoneNumber.number;
            contactNeedUpdate = true;
          }
          console.log('9 Digits Number: +5511' + phoneNumber.number);
        }

        contactPhoneNumbers[index].number = phoneNumber.number;
      }
    });
    console.log('Update Contact on Telephone');
    contactInfo.phoneNumbers = contactPhoneNumbers;
    console.log(contactInfo);
    if (contactNeedUpdate) {
      // let contactUpdateValidation =
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts Write Permissions',
          message: 'We need your permission to Write on your contacts',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ).then(() => {
        ContactServices.updateContact(contactInfo);
        // if (contactUpdateValidation.status === true) {
        //   console.log('Contact Updated Sucessfully');
        // }
      });
    }
  }

  function verifyContactsInternationalCode(phoneNumber: string) {
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

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      <View>
        <Text style={styles.textDefaultTitle}>Home Component</Text>
        <BackupContacts contactsBackup={contactList} />
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
                        {contacts.phoneNumbers.map((phoneNumber, indexPhoneNumber) => {
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
    marginHorizontal: 20,
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
