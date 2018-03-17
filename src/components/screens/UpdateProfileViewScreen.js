import React from 'react'
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
} from "react-native"

import * as ActionTypes from "../../constants/ActionTypes"
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import BaseViewScreen from "./BaseViewScreen"

var t = require('tcomb-form-native')
var Form = t.form.Form;

class UpdateProfileViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.currentUser = this.props.navigation.state.params.currentUser

        this.User = t.struct({
            displayName: t.maybe(t.String),      // a required string
            nickName: t.maybe(t.String),  // an optional string
            email: t.maybe(t.String),  // an optional string
            phoneNumber: t.maybe(t.Number),  // an optional string
        })

        this.options = {
            fields: {
                displayName: {
                    placeholder: this.currentUser.displayName,
                    editable: false,
                    autoCorrect: false,
                    label: "Name",
                },
                nickName: {
                    autoCorrect: false,
                    label: "Nick Name",
                },
                email: {
                    editable: this.currentUser.email ? false : true,
                    placeholder: this.currentUser.email,
                    autoCorrect: false,
                    label: "Email",
                },
                phoneNumber: {
                    placeholder: this.currentUser.phoneNumber,
                    autoCorrect: false,
                    label: "Phone Number",
                }
            }
        }

        this.values = {
            displayName: this.currentUser.displayName,
            nickName: this.currentUser.nickName,
            email: this.currentUser.email,
            phoneNumber: this.currentUser.phoneNumber,
        }
    }

    updateUserEmail = (firebaseUser, userInfo) => {
        console.log("UpdateProfileViewScreen updateUserEmail : " + JSON.stringify(userInfo))

        this.props.dispatch({
            type: ActionTypes.SAGA_UPDATE_USER_EMAIL,
            data: {firebaseUser: firebaseUser, userInfo: userInfo}
        })
    }

    render = () => {
        return (
            <KeyboardAwareScrollView style={styles.container}>
                <View style={styles.containerContent}>
                    <Form
                        ref="form"
                        type={this.User}
                        options={this.options}
                        value={this.values}
                    />

                    <TouchableHighlight
                        style={styles.button}
                        onPress={() => {
                            const value = this.refs.form.getValue()
                            this.updateUserEmail(this.currentUser, value)
                        }}
                        underlayColor='#99d9f4'>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableHighlight>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

export default UpdateProfileViewScreen

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




