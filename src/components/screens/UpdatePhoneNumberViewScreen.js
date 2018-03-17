import React from 'react'
import {
    Button,
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
} from "react-native"

import firebase from 'react-native-firebase'
import * as ActionTypes from "../../constants/ActionTypes"
import BaseViewScreen from "./BaseViewScreen"

var t = require('tcomb-form-native')
var Form = t.form.Form;

class UpdatePhoneNumberViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.state = {
            isSentConfirmCode: false,
            confirmationResult: null,
        }

        this.currentUser = this.props.navigation.state.params.currentUser

        this.PhoneNumberInputForm = t.struct({
            phoneNumber: t.String,
        })

        this.ConfirmCodeInputForm = t.struct({
            code: t.Number,
        })
    }

    signinWithPhoneNumber = () => {
        const phoneNumber = "+841629715498"

        firebase.auth().signInWithPhoneNumber(phoneNumber)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log("signinWithPhoneNumber confirmationResult: " + JSON.stringify(confirmationResult))
                this.setState({isSentConfirmCode: true, confirmationResult: confirmationResult})
            }).catch(function (error) {
            // Error; SMS not sent
            console.log("signinWithPhoneNumber error: " + JSON.stringify(error))
        })

    }

    confirmCode = (code) => {
        if (this.state.confirmationResult && code.length) {
            this.state.confirmationResult.confirm(code)
                .then((user) => {
                    console.log("signinWithPhoneNumber user: " + JSON.stringify(user))
                })
                .catch(error => {
                    console.log("signinWithPhoneNumber confirmCode error: " + JSON.stringify(error))

                });
        }

        // console.log("signinWithPhoneNumber code: " + code)
        // console.log("signinWithPhoneNumber _verificationId: " + this.state.confirmationResult._verificationId)
        //
        // var phoneCredential = firebase.auth.PhoneAuthProvider
        //     .credential(this.state.confirmationResult._verificationId, code)
        //
        // console.log("signinWithPhoneNumber phoneCredential: " + JSON.stringify(phoneCredential))
        //
        // this.currentUser.updatePhoneNumber(phoneCredential)

    }

    renderPhoneNumberInputForm = () => {
        return (
            <View>
                <Form
                    ref="phoneNumberInputForm"
                    type={this.PhoneNumberInputForm}
                />

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                        this.signinWithPhoneNumber()
                    }}
                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableHighlight>
            </View>
        )
    }

    renderConfirmationCodeInputForm = () => {
        return (
            <View>
                <Form
                    ref="confirmCodeInputForm"
                    type={this.ConfirmCodeInputForm}
                />

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                        const value = this.refs.confirmCodeInputForm.getValue()
                        const code = value.code
                        this.confirmCode(code)
                    }}
                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableHighlight>
            </View>
        )
    }

    render = () => {
        return (
            <View style={styles.containerContent}>
                {this.state.isSentConfirmCode ?
                    this.renderConfirmationCodeInputForm() :
                    this.renderPhoneNumberInputForm()
                }
            </View>
        )
    }

    componentWillReceiveProps = (newProps) => {

    }
}

export default UpdatePhoneNumberViewScreen

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    containerContent: {
        flex: 1,
        // justifyContent: 'center',
        marginTop: 0,
        padding: 20,
        backgroundColor: '#ffffff',
    },

    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});




