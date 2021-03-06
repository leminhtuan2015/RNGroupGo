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
import * as Constant from "../../utils/Constant"
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import BaseViewScreen from "./BaseViewScreen"
import SettingViewScreen from "./SettingViewScreen"

var t = require('tcomb-form-native')
var Form = t.form.Form;

class InviteFriendViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.state = {isBusy: false}

        this.dialogbox = null
        this.formValues = null

        this.User = t.struct({
            email: t.maybe(t.String),
        })

        this.options = {
            fields: {
                email: {
                    placeholder: "Friend's email ",
                    autoCorrect: false,
                    label: "Friend's email ",
                    autoCapitalize: "none",
                    autoFocus: true,
                },
            }
        }
    }

    setFormValue = (user) => {
        this.formValues = {
            email: user.email,
        }
    }

    onFormValue = (value) => {
        this.setFormValue(value)
    }

    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    sendEmail = (email) => {

        const htmlContent = 
        "<ul>" + 
        "<li><b>IOS:</b> https://itunes.apple.com/us/developer/apple/" + SettingViewScreen.APPLE_APP_ID + "?mt=8</li>"
        + "<li><b>Android:</b> https://play.google.com/store/apps/details?id=" + SettingViewScreen.GOOGLE_APP_ID + "</li>"
        + "</ul>"

        this.props.dispatch({
            type: ActionTypes.SAGA_SEND_EMAIL,
            data: {
                url: Constant.FIREBASE_FUNCTIONS_SEND_MAIL,
                toEmailAddress: email,
                emailSubject: "Invitation to use Location Sharing app",
                emailHtmlContent: htmlContent,
            }
        })
    }

    inviteFriend = (value) => {
        let email = value.email

        if (email) {
            if (this.validateEmail(email)) {
                this.sendEmail(email)

                this.dialogbox.tip({
                    title: "Successful",
                    content: "Invitation has been sent",
                    btn: {
                        text: "OK",
                        callback: () => {
                            this.props.navigation.goBack()
                        },
                    },
                });
            } else {
                this.dialogbox.tip({
                    title: "Error",
                    content: "Please enter a valid email address",
                    btn: {
                        text: "OK",
                        callback: () => {
                        },
                    },
                });
            }

        } else {
            this.dialogbox.tip({
                title: "Notification",
                content: "Please fill in the email field",
                btn: {
                    text: "OK",
                    callback: () => {
                    },
                },
            });
        }

    }

    renderIndicator = () => {
        return (
            <ActivityIndicatorCustom/>
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
                        // this.setState({isBusy: true})
                        const value = this.refs.form.getValue()
                        this.inviteFriend(value)
                    }}
                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Send Invite</Text>
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

    }

    componentDidMount = () => {
        this.props.navigation.setParams({headerTitle: "Invite Friend"})
    }
}

export default InviteFriendViewScreen

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




