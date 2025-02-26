import { StyleSheet } from "react-native"
import THEME from "./theme"

const globalStyles = StyleSheet.create({
    containerContentCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    button: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#06339f',
        margin: 1,
        minWidth: 100,
        alignItems: 'center',
        boxShadow: '1px 1px 1px black'
    },
    buttonText: {
        color: THEME.color,
        fontFamily: THEME.fontFamily,
        fontWeight: 'bold',
        fontSize: 20,
    },
    textInput: {
        fontSize: 20,
        borderColor: "gray",
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
})

export default globalStyles