import React, { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 
import msgService from '../../services/msgService';
import DefaultStyles from '../../styles/styles';

const Splash = ({ navigation }: any) => {
    const navigateToBackup = (screen: string) => {
        navigation.navigate(screen, { advance: 'ok' });
    }

    return (
        <>
            <View style={[DefaultStyles.container]}>
                <Text style={[styles.textDefaultTitle, styles.marginDefautElements]}>Olá Galerá, Hello guys.</Text>
                <Text style={[styles.textDefault, styles.marginDefautElements]}>Essa é a primeira versão do Contact Plus,
                    um aplicativo para corrigir seus contatos do Brasil/Outros Países depois de você mudar
                    de país ou reinstalar o Whatsapp ou outro app de conversa em outro país.
                </Text>
                <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements]}>Será necessário conceder a permissão para ler seus contatos e salvar dados. 
                </Text>      
                <Text style={[DefaultStyles.textDefault, DefaultStyles.marginDefautElements, DefaultStyles.textBold]}>Não se preocupe os contatos só são salvos no Telefone e não são enviados para nenhum outro lugar.
                </Text>                             
            </View>  
            <View style={[DefaultStyles.bottomCenter,DefaultStyles.container]}>
                <Text style={[DefaultStyles.textDefaultInfo, styles.marginDefautElements]}>
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
    textDefaultTitle: {
        marginTop: 10,
        color: '#219EBC',
        fontWeight: '900',
        fontSize: 25,
    },

});

export default Splash;