import { StyleSheet } from 'react-native';

const DefaultStyles = StyleSheet.create({
    marginDefautElements:{
        marginTop: 10,
        marginBottom: 10,
    },
    labelDefaultNormal: {
      color: '#219EBC',
      fontSize: 13,
    },    
    textDefaultNormal: {
      color: '#000',
      fontSize: 13,
    },
    textBold: {
      fontWeight: 'bold',
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
    textDefaultInfo: {
        marginTop: 10,
        color: '#219EBC',
        fontWeight: '900',
        fontSize: 17,
    },    
    hideComponents:{
        display: 'none',
    },
    bottomCenter: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    },  
    //Rows and Columns
    viewColumn: {
      flex: 1,
      alignContent:'flex-end',
    },
    viewRow: {
      flexDirection: 'row',
      alignItems: 'center'
      // borderBottomColor: '#219EBC',
      // textAlignVertical: 'center',
    },
    viewRowTextVerticalCenter: {
      textAlignVertical: 'center',
      alignItems: 'center'
    },
    textInput:{
      backgroundColor: 'transparent',
      // marginHorizontal: 5,
      borderStyle: 'dashed',
      borderWidth: 2,
      borderBottomColor: '#219EBC',
      borderTopColor: '#219EBC',  
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',      
      color: '#219EBC',
      textAlign: 'center',
      padding: 3,        
    },
    inputTextLayout:{
      borderBottomColor: '#219EBC',
      borderTopColor: '#219EBC',    
      color: '#219EBC',
      fontWeight: 'bold',
      textAlignVertical: 'center',
    },    
    containerVerticalSpace:{
      marginTop: 15,
    },
    viewAlignOnTop:{
      alignItems: 'flex-start',
    }

});

export default DefaultStyles;