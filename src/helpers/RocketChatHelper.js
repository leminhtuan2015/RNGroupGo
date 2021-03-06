// import DDP from "react-ddp";
// import Meteor from 'react-native-meteor';
// import DDPClient from "ddp";
import DDPClient from "ddp-client";
import * as Utils from "../utils/Utils"

const serverHost = "wss://open.rocket.chat/websocket";
const authToken = "32mnBoMBAYXGU-YP94XZ6oNm01II6di2cSv6qGouRck";
const userId = "a4JtGAoBZmkvbKPs7"
const subscribe = "GENERAL";

const ddpclient = new DDPClient({
    // All properties optional, defaults shown
    host: "open.rocket.chat",
    port: 3000,
    ssl: false,
    autoReconnect: true,
    autoReconnectTimer: 500,
    maintainCollections: true,
    ddpVersion: '1',  // ['1', 'pre2', 'pre1'] available
    // Use a full url instead of a set of `host`, `port` and `ssl`
    url: 'wss://open.rocket.chat/websocket',
    socketConstructor: WebSocket // Another constructor to create new WebSockets
});

class RocketChatHelper {

    static subscribe(onMessage) {
        process.nextTick = setImmediate

        console.log("RocketChatHelper Initing")
        console.log("RocketChatHelper Connecting")

        ddpclient.connect(function (error, wasReconnect) {
            if (error) {
                console.log('DDP connection error!');
                return;
            }

            if (wasReconnect) {
                console.log('Reestablishment of a connection.');
            }

            console.log('ddpclient connected!')

            ddpclient.call(
                'login',             // name of Meteor Method being called
                [{ "resume": authToken }],            // parameters to send to Meteor Method
                function (err, result) {   // callback which returns the method call results
                    console.log('called login success: ' + JSON.stringify(result));

                    if (err) {
                        console.log('called login err: ' + JSON.stringify(err));
                    } else {
                        ddpclient.subscribe("stream-room-messages", [subscribe, false], function () {
                            console.log("Subscription Complete.\n");
                            ddpclient.on("message", function (msg) {
                                // console.log("On message -----> : " + msg);
                                const msgJson = JSON.parse(msg)
                                if (msgJson.msg == "changed") {
                                    onMessage(msgJson)
                                }
                            });
                        })
                    }
                });
        });
    }

    static sendMessageToRocket = (text) => {
        console.log("sendMessageToRocket :" + text)

        fetch('https://open.rocket.chat/api/v1/chat.postMessage', {
            method: 'POST',
            headers: {
                "X-Auth-Token": authToken,
                "X-User-Id": userId,
                "Accept": 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "channel": "#general",
                "text": text
            }),
        });

    }

    static sendLiveMessageToRocket = (text) => {
        ddpclient.call(
            'livechat:getInitialData',             // name of Meteor Method being called
            [{visitorToken: authToken}],
            function (result) {   // callback which returns the method call results
                console.log('called getInitialData done: ' + JSON.stringify(result));
            });

        ddpclient.call(
            'sendMessageLivechat',             // name of Meteor Method being called
            [{
                "_id": userId,
                "rid": Utils.guid(),
                "msg": "test",
                "token": authToken
            }],
            function (result) {   // callback which returns the method call results
                console.log('called sendMessageLivechat done: ' + JSON.stringify(result));
            });
    }
}

export default RocketChatHelper

