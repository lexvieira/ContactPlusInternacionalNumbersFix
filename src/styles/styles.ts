import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
//https://encycolorpedia.com/219ebc //Color Patterns
const DefaultStyles = StyleSheet.create({
  containerScreen: {
    minHeight: Dimensions.get('screen').height,
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 10,
    textAlign: 'justify',
    backgroundColor: '#FFF',
    borderColor: '#219EBC',
    borderWidth: 1,
    margin: 2
  },
  defaultContainer: {
    padding: 5,
    textAlign: 'justify',
    backgroundColor: '#FFF',
    borderColor: '#219EBC',
    borderWidth: 0,
    margin: 2
  },  
  marginDefautElements: {
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
  textDefaultTitle: {
    marginTop: 3,
    color: '#219EBC',
    fontWeight: '900',
    fontSize: 22,
    textAlign: 'justify'
  },
  textDefaultInfo: {
    marginTop: 3,
    color: '#219EBC',
    fontWeight: '900',
    fontSize: 17,
  },
  hideComponents: {
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
    alignContent: 'flex-end',
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  viewRowTitle:{
    fontWeight: 'bold',
    color: '#DE6143'
  },
  viewRowBorder:{
    borderBottomColor: '#219EBC',
    borderBottomWidth: 1,
    paddingBottom: 2
    // textAlignVertical: 'center',
  },
  viewRowTextVerticalCenter: {
    textAlignVertical: 'center',
    alignItems: 'center'
  },
  textInput: {
    backgroundColor: 'transparent',
    // marginHorizontal: 5,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderBottomColor: '#219EBC',
    borderTopColor: '#219EBC',
    borderLeftColor: '#219EBC',
    borderRightColor: '#219EBC',
    borderRadius: 3,
    color: '#219EBC',
    textAlign: 'center',
    padding: 3,
  },
  inputTextLayout: {
    borderBottomColor: '#219EBC',
    borderTopColor: '#219EBC',
    color: '#219EBC',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  containerVerticalSpace: {
    marginTop: 8,
  },
  viewAlignOnTop: {
    alignItems: 'flex-start',
  },
  viewVerticalAlignCenter: {
    alignItems: 'center',
  },
  ScrollBox: {
    backgroundColor: 'transparent',
    // marginHorizontal: 5,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderBottomColor: '#219EBC',
    borderTopColor: '#219EBC',
    borderLeftColor: '#219EBC',
    borderRightColor: '#219EBC',
    borderRadius: 3,
    color: '#219EBC',
    textAlign: 'center',
    padding: 3,    
  }
});
export default DefaultStyles;