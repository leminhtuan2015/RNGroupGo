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
import RocketChatHelper from "../../helpers/RocketChatHelper"

class ChatViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        RocketChatHelper.subscribe()
    }

    onClickButton = () => {
        console.log("Hello")

        fetch('https://open.rocket.chat/api/v1/chat.postMessage', {
            method: 'POST',
            headers: {
                "X-Auth-Token": "32mnBoMBAYXGU-YP94XZ6oNm01II6di2cSv6qGouRck",
                "X-User-Id": "a4JtGAoBZmkvbKPs7",
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
