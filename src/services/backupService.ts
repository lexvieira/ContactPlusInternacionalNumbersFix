import AsyncStorage from "@react-native-community/async-storage";
import msgService from "./msgService";

class BackupServices {
  STORAGE_KEY_CONTACTS_BACKUP = '@Contacts_Backup_Phone';
  STORAGE_KEY_CONTACTS_BACKUP_DATETIME = '@date_last_Backup';  
  
    readContactsBackup = async (STORAGE_KEY: string) => {
        try {
            console.log("Permission Read agreeded")
            const contactBackup: any = await AsyncStorage.getItem(STORAGE_KEY);
            console.log("Getting Backup")
            // console.log(contactBackup);
            console.log("Finishing Backup")
            return JSON.parse(contactBackup);
            // Alert.alert(
            //   'Backup lido com sucesso',
            //   `Total Contacts Loaded: ${contactBackup != null ? JSON.parse(contactBackup).length : 0}`,
            // );
            // console.log(contactBackup);
        } catch (e) {
          return e;
        }
      };
}

export default new BackupServices();