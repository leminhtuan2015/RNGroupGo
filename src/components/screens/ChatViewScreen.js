import React from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    ListView,
    StyleSheet,
    Linking,
    Platform,
    Button,
} from "react-native"

import {
    List,
    ListItem,
} from 'react-native-elements'

import AppLink from 'react-native-app-link'
import DialogBox from "react-native-dialogbox"
import BaseViewScreen from "./BaseViewScreen";
import IconManager from "../../utils/IconManager";
import RocketChatSubscription from "../../helpers/RocketChatSubscription"

class ChatViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        RocketChatSubscription.subscribe()
    }

    onClickButton = () => {
        console.log("Hello")

        fetch('http://localhost:3000/api/v1/chat.postMessage', {
            method: 'POST',
            headers: {
                "X-Auth-Token": "WTSr59QZg1iZ-E1ZzUZpG0Bcp0PgQhIpJG50torh7LW",
                "X-User-Id": "ghKGbKC3EcP6uKyem",
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "channel": "#general", 
                "text": "Tun!" 
            }),
        });

    }

    render = () => {
        return (
            <View style={styles.container}>
                <Button
                    onPress={() => {
                        this.onClickButton()
                    }}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        )
    }

    componentDidMount = () => {
        this.props.navigation.setParams({ headerTitle: "Chat" })
    }
}

export default ChatViewScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        backgroundColor: "white",
    },

    contentContainer: {
        // paddingVertical: 0,
        // paddingBottom: 60
    },

});
