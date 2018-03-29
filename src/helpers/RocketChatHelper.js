import DDP from "react-ddp";
import Meteor from 'react-native-meteor';

const serverHost = "wss://open.rocket.chat/websocket";
const authToken = "32mnBoMBAYXGU-YP94XZ6oNm01II6di2cSv6qGouRck";
const subscribe = "GENERAL";



class RocketChatHelper {

    static subscribe() {
        console.log("RocketChatHelper Initing")

        Meteor.connect(serverHost);

        console.log("RocketChatHelper Connecting")

        Meteor.call('login', [{ "resume": authToken }], (error, result) => {
            if(error){
                console.log("RocketChatHelper login error : " + JSON.stringify(error))
            } else {
                console.log("RocketChatHelper login ok")
            }
        });
    }
}

export default RocketChatHelper