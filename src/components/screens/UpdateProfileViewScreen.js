import React from 'react'
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
} from "react-native"

import ActivityIndicatorCustom from "../views/ActivityIndicatorCustom";
import DialogBox from "react-native-dialogbox"
import * as ActionTypes from "../../constants/ActionTypes"
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import BaseViewScreen from "./BaseViewScreen"

var t = require('tcomb-form-native')
var Form = t.form.Form;

class UpdateProfileViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.state = {isBusy: false}

        this.currentUser = this.props.navigation.state.params.currentUser
        this.dialogbox = null
        this.formValues = null

        this.User = t.struct({
            displayName: t.maybe(t.String),      // a required string
            email: t.maybe(t.String),  // an optional string
            // phoneNumber: t.maybe(t.Number),  // an optional string
        })

        this.options = {
            fields: {
                displayName: {
                    placeholder: this.currentUser.displayName,
                    // editable: false,
                    autoCorrect: false,
                    label: "Name",
                },
                email: {
                    placeholder: this.currentUser.email,
                    // editable: this.currentUser.email ? false : true,
                    autoCorrect: false,
                    label: "Email",
                },
                // phoneNumber: {
                //     placeholder: this.currentUser.phoneNumber,
                //     autoCorrect: false,
                //     label: "Phone Number",
                // }
            }
        }

        this.setFormValue(this.currentUser)
    }

    setFormValue = (user) => {
        this.formValues = {
            displayName: user.displayName,
            email: user.email,
            // phoneNumber: this.currentUser.phoneNumber,
        }
    }

    onFormValue = (value) => {
        this.setFormValue(value)
    }

    updateUserInfo = (firebaseUser, userInfo) => {
        console.log("UpdateProfileViewScreen updateUserEmail : " + JSON.stringify(userInfo))

        this.props.dispatch({
            type: ActionTypes.SAGA_UPDATE_USER_INFO,
            data: {firebaseUser: firebaseUser, userInfo: userInfo}
        })
    }

    renderNeedToReAuth = (userState) => {
        let title = ""
        if (userState.isNeedReAuth) {
            title = "Please re-login to update email!"
        } else {
            title = "Updated Successful"
        }

        this.dialogbox.tip({
            title: title,
            content: "",
            btn: {
                text: "OK",
                callback: () => {
                },
            },
        });
    }

    renderIndicator = () => {
        return(
            <ActivityIndicatorCustom />
        )
    }

    renderForm = () => {
        return (
            <View>
                <Form
                    ref="form"
                    type={this.User}
                    options={this.options}
                    value={this.formValues}
                    onChange={this.onFormValue}
                />

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                        this.setState({isBusy: true})
                        const value = this.refs.form.getValue()
                        this.updateUserInfo(this.currentUser, value)
                    }}
                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        )
    }

    render = () => {
        return (
            <KeyboardAwareScrollView style={styles.container}>
                <View style={styles.containerContent}>
                    {this.state.isBusy && this.renderIndicator()}

                    {this.renderForm()}
                </View>

                <DialogBox ref={dialogbox => {
                    this.dialogbox = dialogbox
                }}/>
            </KeyboardAwareScrollView>
        )
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({isBusy: false})
        this.currentUser = newProps.store.userState.currentUser
        this.setFormValue(this.currentUser)
        this.renderNeedToReAuth(newProps.store.userState)
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




