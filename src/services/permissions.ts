import { PermissionsAndroid } from "react-native";
import msgService from "./msgService";

//Implement
class checkPermissions {
    checkPermissionsContacts = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS, {
            title: 'Contacts',
            message: 'We need your permission to access your contacts',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }).then(() => {
            // console.log("Permission to Write Contacts Granted");
            return true;
        }).catch(() => {
            // console.log(`Permission Denied to Save`);
            msgService.messagePopup(
                'Backup Contacts',
                `Permissões para salvar os contatos negada`,
            );
            return false;
        });
    }
    checkPermissionsWriteExternalStorage = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: 'Contacts',
            message: 'Precisamos sua permissão para gravar o Backup dos contatos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }).then(async () => {
            // console.log("Permission Write agreeded")            
            return true;
        }).catch(() => {
            // console.log(`Permission Denied to Save`);
            msgService.messagePopup(
                'Backup Contacts',
                `Permissões para salvar os contatos negada`,
            );
            return false;
        });
    }

    checkPermissionsReadExternalStorage = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            title: 'Contacts',
            message: 'Precisamos sua permissão para ler o Backup dos contatos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }).then(async () => {
            return true;
            // console.log("Permission Read agreeded");
        }).catch(() => {
            msgService.messagePopup(
                'Backup Contacts',
                `Permissões para ler os contatos negada`,
            );
        });
        return false;
    }
}

export default new checkPermissions();