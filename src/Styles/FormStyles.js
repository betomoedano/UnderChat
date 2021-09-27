import {StyleSheet, Dimensions} from "react-native";

const windowWidth= Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const FormStyles = StyleSheet.create({
    container: {
      height:windowHeight
    },

    message:{
      maxWidth: windowWidth * .8,
      alignSelf:"flex-end",
      borderRadius:12,
      paddingHorizontal:10,
      paddingVertical:2,
      marginVertical:5,
      backgroundColor:"#FF375F",
      borderBottomEndRadius:0,
    },
    messageMe:{
      maxWidth: windowWidth * .8,
      alignSelf:"flex-start",
      marginVertical:5,
      borderRadius:12,
      borderBottomStartRadius:0,
      paddingHorizontal:10,
      paddingVertical:2,
      backgroundColor:"#D6D5D590",
    },

    chatContainer:{
      flex: 1,
    },

    messageInput: {
      height:40,
      width:windowWidth / 20 * 16,
      margin:15,
      borderWidth:.5,
      borderRadius:20,
      borderColor:"#b2b2b2",
      textAlign:"left",
      paddingHorizontal:15,
      backgroundColor:"#fafafa",
      
  },
  messageInput2: {
    height:40,
    width:windowWidth / 20 * 16,
    margin:15,
    borderWidth:.5,
    borderRadius:20,
    borderColor:"#FF375F",
    textAlign:"left",
    paddingHorizontal:15,
    backgroundColor:"#fafafa",
    
},

    date:{
      paddingHorizontal: windowWidth/3,
      paddingVertical: 20
    },
    scrollContainer:{
        paddingTop: windowHeight/5,
    },

    input: {
        height: 60,
        width: windowWidth - 70,
        marginBottom:10,
    },
    button: {
        backgroundColor: "#2282A9",
        borderRadius: 10,
        height: 50,
        alignItems:"center",
        justifyContent: "center",
        marginTop:50,
        marginBottom:5,
        color:"#fff"
    },
    links: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10
    },
    error: {
        color: "red",
        paddingTop:5
    },
    bgcontainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
      },
      textbox: {
        backgroundColor: 'white',
        borderColor: 'grey',
        borderWidth: 0.5,
        padding: 5,
        paddingHorizontal: 10,
        fontSize: 13,
        color: 'black',
        height: 50,
        width: 350,
        borderRadius: 8,
      },
    buttonText: {
        color: 'white',
        //fontFamily: 'Palatino-Bold',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase',
      },
      errorTextbox: {
        borderColor: 'red',
        borderWidth: 1,
      },
      labelWrapper: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
        width: 350,
      },
      labelText: {
        color: 'black',
        fontSize: 13,
        textTransform: 'uppercase',
      },
      labelIcon: {
        color: 'black',
        marginRight: 5,
      },
      title: {
        textAlign: 'center',
        marginBottom: 10,
        //fontFamily: 'Palatino-Bold',
        fontSize: 20,
        textTransform: 'uppercase',
      },
      error: {
        color: 'red',
        fontWeight: '600',
        fontSize: 12,
      },
      errorIcon: {color: 'white', alignItems: 'center', paddingRight: 5},
      formError: {
        padding: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'firebrick',
      },
      inputError: {
        color: 'firebrick',
      },
      errorMsg: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      formLinks: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      linkText: {
        color: 'black',
        fontSize: 12,
        //fontFamily: 'Palatino-BoldItalic',
        textShadowColor: 'white',
        textShadowRadius: 6,
        textTransform: 'uppercase',
      },
      bottom:{
          paddingTop: windowHeight - 310
      }
    
});