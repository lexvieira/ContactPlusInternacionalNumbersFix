import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 
import msgService from '../../services/msgService';
import DefaultStyles from '../../styles/styles';

const Splash = ({ navigation }: any) => {
    const navigateToBackup = (screen: string) => {
        // msgService.messagePopup("1 - Backup", "Você está sendo redirecionado para a Tela de Backup");
        navigation.navigate(screen, { advance: 'ok' });
    }
    
    //Include here the permissions
    //PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
    //PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS,

    return (
        <>
            <View style={[DefaultStyles.container]}>
                <Text style={[styles.textDefaultTitle, styles.marginDefautElements]}>Olá Galerá, Hello guys.</Text>
                <Text style={[styles.textDefault, styles.marginDefautElements]}>Essa é a primeira versão do Contact Plus,
                    um aplicativo para corrigir seus contatos do Brasil/Outros Países depois de você mudar
                    de país ou reinstalar o Whatsapp ou outro app de conversa em outro país.
                </Text>
                <Text style={[styles.textDefault, styles.marginDefautElements]}>Em breve, lista de países para ficar mais facíl a seleção, multilinguagem e outras opções.
                </Text>                
            </View>  
            <View style={[DefaultStyles.bottomCenter,DefaultStyles.container]}>
                <Text style={[styles.textDefault, styles.marginDefautElements]}>
                    1⁰ Faça o Backup dos seus contatos
                </Text>
                <Button  onPress={() => { navigateToBackup('Backup') }} title="Backup Contacts" >
                    </Button>
            </View>
            
        </>
    )
};

const styles = StyleSheet.create({
    marginDefautElements:{
        marginTop: 10,
        marginBottom: 10,
    },
    textDefault: {
        color: '#000',
        fontSize: 17,
        // fontFamily: Roboto, 
    },
    buttonNext: {
        backgroundColor: '#FFF'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        padding: 10,
        textAlign: 'justify',
        backgroundColor: '#FFF',
        borderColor: '#219EBC',
    },
    textDefaultTitle: {
        marginTop: 10,
        color: '#219EBC',
        fontWeight: '900',
        fontSize: 25,
    },

});

export default Splash;