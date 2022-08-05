import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import contacts from '../../services/contacts';
import utils, { countryDetails } from '../../services/utils';
import DefaultStyles from '../../styles/styles';

interface Props {
    contactsExample: {
        countryCode: number,
        areaCode: number,
        countryDesc: string
    };
}

// const BackupContacts: React.FC<Props> = ({ contactsBackup }: Props) => {

const Example: React.FC<Props> = ({ contactsExample }: Props) => {
    const countryCode = contactsExample.countryCode;
    const areaCode = contactsExample.areaCode;
    const countryDesc = contactsExample.countryDesc;
    const [countryDetails, setCountryDetails] = useState<countryDetails[]>();
    const [areaBRDDD, setAreaBRDDD] = useState("");


    const getCountryDetails = async (country_code: number) => {
        let country_details = await utils.filterCountry(country_code);
        setCountryDetails(country_details);
    }

    const getAreaBr = async (area_code: number) => {
        let areaBR = await utils.filterAreaBR(area_code);
        setAreaBRDDD(areaBR);
    }

    useEffect(() => {
        getCountryDetails(countryCode);
    }, [countryCode])

    useEffect(() => {
        getAreaBr(areaCode);
    }, [areaCode])    

    return (
        <View style={DefaultStyles.viewColumn}>
            {
                countryDetails?.map((country) => {
                    return (
                        <Text key={country.dial_code} style={[DefaultStyles.textDefaultNormal, DefaultStyles.textBold]}>{country.name} {country.dial_code} {country.code} {country.emoji} - {areaBRDDD} ({areaCode}) - Obs (Usuário): {countryDesc} </Text>
                    )
                })
            }
            <Text style={[DefaultStyles.labelDefaultNormal, DefaultStyles.textBold, { color: 'red' }]}>Exemplo: Antes: André Felix 983432233</Text>
            <Text style={[DefaultStyles.textDefaultNormal, DefaultStyles.textBold]}>Depois: André Felix ({countryDesc}) +{countryCode}{areaCode}983432233</Text>
        </View>
    )
};

export default Example;
