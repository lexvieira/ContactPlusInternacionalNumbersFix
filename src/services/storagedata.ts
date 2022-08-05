import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

class storage{
    
  readContactsBackup = async () => new Promise<any>((resolve) => {
    try {
      const contact_Backup_data: any = AsyncStorage.getItem(
        '@contact_Backup',
      ).then(() => {
        return resolve(JSON.parse(contact_Backup_data));
      });
    } catch (e) {
      // console.log(`Error Return: ${e}`);
      return resolve(JSON.parse(""));
    }
  });
}

export default new storage();