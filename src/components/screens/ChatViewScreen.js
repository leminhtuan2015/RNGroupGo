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
            console.log("<<<<<<<<<<<<<<<<<<<<<< Got message: " + msgJson)

            const avatar = "https://open.rocket.chat/avatar/" + msgJson.fields.args[0].u.username

            console.log("avatar : " + avatar)

            const newMessages = [
                {
                    _id: msgJson.fields.args[0]._id,
                    text: msgJson.fields.args[0].msg,
                    createdAt: new Date(),
                    user: {
                        _id: msgJson.fields.args[0].u._id,
                        name: msgJson.fields.args[0].u.username,
                        avatar: avatar
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

        const text = messages[0].text

        // RocketChatHelper.sendMessageToRocket(text)
        RocketChatHelper.sendLiveMessageToRocket(text)
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

    render = () => {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    renderMessage={this.renderMessage}
                    onSend={messages => this.onSend(messages)}
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
