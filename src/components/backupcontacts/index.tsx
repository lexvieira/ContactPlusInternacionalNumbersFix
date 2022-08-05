import React, { useEffect, useState } from 'react';
import { Alert, Button, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
// import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { Contact } from 'react-native-contacts';
import ContactServices from '../../services/contacts';
import DefaultStyles from "../../styles/styles";
import msgService from '../../services/msgService';
import storage from '../../services/storagedata';
import backupService from '../../services/backupService';
import utils from '../../services/utils';

// interface Props {
//   contactsBackup: Contact[];
// }

// const BackupContacts: React.FC<Props> = ({ contactsBackup }: Props) => {


const Backup = ({ navigation }: any) => {
  const platform = Platform.OS.toString();
  const [permissionRead, setpermissionRead] = useState(false);
  const [permissionWrite, setpermissionWrite] = useState(false);
  const [permissionContacts, setpermissionContacts] = useState(false);
  const [backupExist, setBackupExist] = useState(false);
  const [totalContacts, setTotalContacts] = useState(0);
  const [contactsPhone, setcontactsPhone] = useState<Contact[]>([]);
  const [backupContacts, setBackupContacts] = useState<Contact[]>([]);
  const [totalBackupContacts, setTotalBackupContacts] = useState(0);
  const [date_last_Backup, setDate_last_Backup] = useState("");
  const [contact_Backup_data, setContact_Backup_data] = useState([]);
  const STORAGE_KEY_CONTACTS_BACKUP = backupService.STORAGE_KEY_CONTACTS_BACKUP;
  const STORAGE_KEY_CONTACTS_BACKUP_DATETIME = backupService.STORAGE_KEY_CONTACTS_BACKUP_DATETIME;

  useEffect(() => {
    console.log("Checking Permissions");
    checkPermissions();
    console.log("Checking Permissions Finish");
  }, []);

  useEffect(() => {
    console.log("Getting Contacts");
    getContacts();
    console.log("Getting Contacts Finish");
  }, [permissionContacts]);

  // useEffect(() => {
  //   console.log("Checking Backup");
  //   // checkBackup();
  //   console.log("Checking Backup Finish");
  // }, [backupExist, totalBackupContacts]);

  const navigateToBackup = (screen: string) => {
    // msgService.messagePopup("1 - Backup", "Você está sendo redirecionado para a Tela de Backup");
    navigation.navigate(screen, { advance: 'ok' });
  }

  function getContacts() {
    if (permissionContacts) {
      ContactServices.getAllContacts()
        .then(contacts => {
          setcontactsPhone(contacts);
          setTotalContacts(contacts.length);
          // Checking Contacts Backup
          checkBackup();
        })
        .catch(err => {
          if (err) {
            throw err;
          }
        });
    }
  }
  //   var db = openDatabase({name: 'ContactsBackupPlus.db'});

  const checkPermissions = async () => {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS, {
      title: 'Contacts',
      message: 'We need your permission to access your contacts',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }).then(() => {
      console.log("Permission to Write Contacts Granted");
      setpermissionContacts(true);
    }).catch(() => {
      console.log(`Permission Denied to Save`);
      msgService.messagePopup(
        'Backup Contacts',
        `Permissões para salvar os contatos negada`,
      );
    });

    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      title: 'Contacts',
      message: 'Precisamos sua permissão para gravar o Backup dos contatos',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }).then(async () => {
      setpermissionWrite(true);
      console.log("Permission Write agreeded")
    }).catch(() => {
      console.log(`Permission Denied to Save`);
      msgService.messagePopup(
        'Backup Contacts',
        `Permissões para salvar os contatos negada`,
      );
    });

    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
      title: 'Contacts',
      message: 'Precisamos sua permissão para ler o Backup dos contatos',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }).then(async () => {
      setpermissionRead(true);
      console.log("Permission Read agreeded");
    }).catch(() => {
      msgService.messagePopup(
        'Backup Contacts',
        `Permissões para ler os contatos negada`,
      );
    });

  }

  // checkPermissions();
  // getContacts();

  const backupContactsLocally = async () => {
    try {
      const contactsJsonFile = JSON.stringify(contactsPhone);
      let date = new Date();
      let day_backup = date.getDate();
      let month_backup = date.getMonth()+1;
      let year_backup = date.getFullYear();
      let hour_backup = date.getHours();
      let minutes_backup = date.getMinutes();
      let date_format = `${utils.formatZerosLeft(day_backup,2)}/${utils.formatZerosLeft(month_backup,2)}/${year_backup} ${utils.formatZerosLeft(hour_backup,2)}:${utils.formatZerosLeft(minutes_backup,2)}`
      if (contactsJsonFile.length >= 0) {
        try {
          if (permissionWrite) {
            await AsyncStorage.setItem(STORAGE_KEY_CONTACTS_BACKUP, contactsJsonFile).then(async () => {
              setBackupExist(true);
              try {
                const readContactsBase: any = await AsyncStorage.getItem(
                  STORAGE_KEY_CONTACTS_BACKUP,
                )
                // console.log(readContactsBase);   
                setBackupContacts(JSON.parse(readContactsBase));
                setTotalBackupContacts(JSON.parse(readContactsBase).length);
              } catch (e) {
                console.log("Error saving Backup Contacts");
              }
            });
            setDate_last_Backup(date_format);
            await AsyncStorage.setItem(STORAGE_KEY_CONTACTS_BACKUP_DATETIME, date_format);
            console.log('Success Saving File');
          }
          // const readContactsBase =  await storage.readContactsBackup();
        } catch (e) {
          console.log("Error saving the Backup");
          msgService.messagePopup(
            'Backup Contacts',
            `Erro : Desculpe, erro Salvando o backup dos contatos`,
          );
        }

      }
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const readContactsBackup = async () => {

    try {
      const contactBackup = await backupService.readContactsBackup(STORAGE_KEY_CONTACTS_BACKUP);
      setBackupContacts(contactBackup);
      Alert.alert(
        'Backup lido com sucesso',
        `Total Contacts Loaded: ${backupContacts != null ? backupContacts.length : 0}`,
      );      
    }
    catch (e) {
      console.log(e);
      msgService.messagePopup(
        'Falha ao ler o Backup',
        `Não foi possível ler o backup, você pode executar um novo backup antes de corrigir os contatos`,
      );
    }
  };

  //Remove or Use service
  const readContactsBackup2 = async () => {
    try {
      const contact_Backup_data: any = await storage.readContactsBackup().then(() => {
        setBackupContacts(JSON.parse(contact_Backup_data));
        Alert.alert(
          'Backup lido com sucesso',
          `Total Contacts Loaded: ${backupContacts.length}`,
        );
      });
      // console.log(contact_Backup_data);
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const clearContactsBackup = async () => {
    try {
      const date_last_Backup: any = await AsyncStorage.getItem(
        STORAGE_KEY_CONTACTS_BACKUP_DATETIME,
      );
      await msgService.messagePopupWithCancel("Deletar Backup?", `Você irá apagar o seu backup criado em: ${date_last_Backup == null ? "Sem Data" : date_last_Backup}`, "Confirmar", "Cancelar").then((resolveReturnMsg) => {
        console.log(resolveReturnMsg);
        if (resolveReturnMsg) {
          AsyncStorage.clear().then(async () => {
            const contactBackup: any = await AsyncStorage.getItem(STORAGE_KEY_CONTACTS_BACKUP);
            console.log("Getting Backup, checking clear");
            // console.log(contactBackup);
            if (contactBackup == null) {
              setBackupExist(false)
            }
            // console.log(contactBackup);
            console.log("Finishing Backup, checking clear");
            // setBackupContacts(JSON.parse(contactBackup));
            console.log("Backup Erased");
            msgService.messagePopup("Backup deletado!", "Antes de Corrigir seus contatos, crie um novo backup por segurança");
          });
        } else {
          msgService.messagePopup("Backup", "Você cancelou a operação");
        }
      });
    } catch (e) {
      console.log(`Error Return: ${e}`);
    }
  };

  const removeKey = async (keyString: string) => {
    try {
      await AsyncStorage.removeItem(`@${keyString}`);
      console.log(`Key ${keyString} Removed`);
      return true;
    } catch (e) {
      console.log(`Error Removing Backup ${keyString}: ${e}`);
    }
  };

  const checkBackup = async () => {
    let date_last_Backup: any;
    let contact_Backup_data: any = await AsyncStorage.getItem(
      STORAGE_KEY_CONTACTS_BACKUP,
    )
    // console.log(`Checking Backups: ${contact_Backup_data}`);

    setContact_Backup_data(contact_Backup_data);
    date_last_Backup = await AsyncStorage.getItem(STORAGE_KEY_CONTACTS_BACKUP_DATETIME)
    setDate_last_Backup(date_last_Backup);
    console.log(`Total Data Backup: ${contact_Backup_data != null ? JSON.parse(contact_Backup_data).length : 0} - on: ${date_last_Backup == null ? "No Data Recorded" : date_last_Backup}`);
    // console.log(contact_Backup_data);    
    if (contact_Backup_data == undefined) {
      setBackupExist(false);
      if (contact_Backup_data == null) {
        let returnBackupMsg = await msgService.messagePopupWithCancel("Fazer Backup", "Você não tem um Backup dos seus contatos, deseja criar um agora", "Confirmar", "Cancelar");
        //backupContactsLocally(contactsBackup);
        if (returnBackupMsg) {
          backupContactsLocally();
          // return false;
        } else {
          msgService.messagePopup("Sem Backup Ativo", "Não esqueça de criar seu backup antes de corrigir os contatos");
        }
      }
    } else {
      setBackupExist(true);
      setTotalBackupContacts(JSON.parse(contact_Backup_data).length);
      setBackupContacts(JSON.parse(contact_Backup_data));
    }



  }

  return (
    <View style={[DefaultStyles.container, styles.backupView]}>
      <View>
        <Text style={[DefaultStyles.textDefaultInfo, DefaultStyles.marginDefautElements]}>
          Aqui faremos ou validaremos um backup dos seus contatos antes de atualiza-los (Backup Contacts Database before Update your Contacts)
        </Text>
      </View>
      <View>
        <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements]}>
          Backup Feito?:{' '}
          {backupExist
            ? `SIM, Total Contatos: ${totalBackupContacts} - Data Backup: ${date_last_Backup} `
            : 'NÃO, Você ainda não tem backup dos seus contatos, click para fazer o backup agora.'}
        </Text>
        <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements]}>
          Total de Contatos no Telefone: {`${totalContacts}`}
          {totalBackupContacts < totalContacts
            ? `\nVocê tem menos contatos em seu Backup que em seu telefone, talvez seja interessante executar um novo Backup`
            : ''}
        </Text>
        <View style={backupExist && totalBackupContacts >= totalContacts ? DefaultStyles.hideComponents : []}>
          <Button
            title="Backup Contacts"
            onPress={() => {
              backupContactsLocally();
            }}
          />
        </View>
        <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements]}>Ler o Backup dos meus contatos</Text>
        <View>
          <Button
            title="Ler Backup"
            onPress={() => {
              readContactsBackup();
            }}
          />
        </View>
        <View style={DefaultStyles.hideComponents}>
          <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements]}>
            Remove a existent key from the backup (Insert Key Name)
          </Text>
          <View>
            <Button
              title="Click to Remove Key Backup Contacts"
              onPress={() => {
                removeKey('storage_Key');
              }}
            />
          </View>
        </View>
        <View style={!backupExist ? DefaultStyles.hideComponents : []}>
          <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements]}>Clear existents Backups</Text>
          <Button
            title="Zerar Backup"
            onPress={() => {
              clearContactsBackup();
            }}
          />
        </View>
      </View>


      <View style={[DefaultStyles.bottomCenter, !backupExist ? DefaultStyles.hideComponents : null, !permissionContacts ? DefaultStyles.hideComponents : null]}>
        <Text style={[DefaultStyles.textDefaultInfo, DefaultStyles.marginDefautElements]}>
          2⁰ Corrija seus contatos do Brasil, adicionando o código internacional +55
        </Text>
        <Button onPress={() => { navigateToBackup('CountryInfo') }} title="Corrigir Contatos" >
        </Button>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  textDefaultNormal: {
    color: '#000',
    fontSize: 13,
  },
  backupView: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#d9d9d9',
    padding: 5,
  }
});

export default Backup;
