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
import { GiftedChat } from 'react-native-gifted-chat';
import SlackMessage from "../views/SlackMessage"
import emojiUtils from 'emoji-utils';
import PropTypes from 'prop-types';

class ChatViewScreen extends BaseViewScreen {

    constructor(props) {
        super(props)

        this.state = {messages: []}

        RocketChatHelper.subscribe((msgJson) => {
            console.log("Got message: " + msgJson)

            const newMessages = [
                {
                    _id: msgJson.fields.args[0]._id,
                    text: msgJson.fields.args[0].msg,
                    createdAt: new Date(),
                    user: {
                        _id: msgJson.fields.args[0].u._id,
                        name: msgJson.fields.args[0].u.username,
                        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzOT4uekAcWnhWFJ691CSzeyaw81YVHWYXTes30KLNGqqeGag_Xw',
                    },
                },
            ]

            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, newMessages),
            }))
        })
    }

    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello 1',
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        name: 'Tuan 1',
                        avatar: 'https://image.flaticon.com/teams/slug/freepik.jpg',
                    },
                },
                {
                    _id: 2,
                    text: 'Hello 2',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Tuan 2',
                        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzOT4uekAcWnhWFJ691CSzeyaw81YVHWYXTes30KLNGqqeGag_Xw',
                    },
                },
            ],
        })
    }

    onSend(messages = []) {
        console.log("onSend : " + JSON.stringify(messages))

        this.sendMessageToRocket(messages[0].text)
    }

    renderMessage(props) {
        const { currentMessage: { text: currText } } = props;

        let messageTextStyle;

        // Make "pure emoji" messages much bigger than plain text.
        if (currText && emojiUtils.isPureEmojiString(currText)) {
            messageTextStyle = {
                fontSize: 28,
                // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            };
        }

        return (
            <SlackMessage {...props} messageTextStyle={messageTextStyle} />
        );
    }

    sendMessageToRocket = (text) => {
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
                "text": text
            }),
        });

    }

    render = () => {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    renderMessage={this.renderMessage}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 2,
                        name: "Tuan 2",
                        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzOT4uekAcWnhWFJ691CSzeyaw81YVHWYXTes30KLNGqqeGag_Xw',
                    }}
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
