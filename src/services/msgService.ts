import { Alert } from "react-native";

class msgService {

    async messagePopup(label: string, text: string){
      Alert.alert(label, text);
      return true;
    }
    
    messagePopupWithCancel = async (labelAlert: string, textAlert: string, textButtonOK: string, textButtonCancel: string) => new Promise<boolean>((resolve) => {
        Alert.alert(
            labelAlert,
            textAlert,
            [
                {
                    text: textButtonCancel,
                    onPress: () => {
                        resolve(false);
                    },
                    style: "cancel"
                },
                { text: textButtonOK, onPress: () => {
                    return resolve(true);
                }
             }
            ]
        ); 
    });  
}

export default new msgService();
