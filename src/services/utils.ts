import area_br from "../data/codearelist";
import countryCodeList from "../data/codecountrieslist";

export interface countryDetails {
    name: string,
    dial_code: string,
    code: string,
    emoji: string,
}

class Utils {

    formatZerosLeft = (num: number, size: number) => {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    filterCountry = async (filter_code: number) => new Promise<countryDetails[]>(async (resolve) => {
        let countryCode_ = countryCodeList;
        let countryDetails: countryDetails[]
        if (filter_code != null) {
            countryDetails = await countryCode_.filter(country_code => country_code.dial_code == "+" + filter_code);
            console.log(countryDetails);
            return resolve(countryDetails);
        } else {
            resolve([]);
        }
    });

    filterAreaBR = (areacode: number) => {
        if (areacode > 0) {
            let area = area_br.estadoPorDdd[areacode.toString() as keyof typeof area_br.estadoPorDdd];
            return area;
        } else {
            return "";
        }
    }

    // new Promise<string>resolve
    // filterAreaBR = (areacode: number) => (() => {
    //     if (areacode > 0){
    //         let area = area_br.estadoPorDdd[areacode.toString() as keyof typeof area_br.estadoPorDdd];
    //         return (area);               
    //     }else{
    //         return ("");               
    //     }
    // })


}
export default new Utils();