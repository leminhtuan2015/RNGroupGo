import React from 'react'
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
} from "react-native"

import BaseViewScreen from "./BaseViewScreen"

var t = require('tcomb-form-native')
var Form = t.form.Form;

class UpdateProfileViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.Person = t.struct({
            name: t.String,              // a required string
            nickname: t.maybe(t.String),  // an optional string
            email: t.maybe(t.String),  // an optional string
            phone: t.maybe(t.Number),  // an optional string
        })

        this.options = {
            fields: {
                name: {
                    placeholder: "Name",
                    editable: false,
                    autoCorrect: false
                },
                nickname: {
                    autoCorrect: false
                },
                email: {
                    autoCorrect: false
                },
                phone: {
                    autoCorrect: false
                }
            }
        }
    }

    render = () => {
        return (
            <View style={styles.container}>
                <Form
                    ref="form"
                    type={this.Person}
                    options={this.options}
                />

                <TouchableHighlight
                    style={styles.button}
                    onPress={() => {
                        console.log("UpdateProfileViewScreen save")
                    }}
                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

export default UpdateProfileViewScreen

var styles = StyleSheet.create({
    container: {
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




