import DDP from "react-ddp";
import Meteor from 'react-native-meteor';

const serverHost = "wss://localhost:3000/websocket";
const authToken = "WTSr59QZg1iZ-E1ZzUZpG0Bcp0PgQhIpJG50torh7LW";
const subscribe = "GENERAL";



class RocketChatHelper {

    static subscribe() {
        console.log("RocketChatHelper Initing")

        Meteor.connect(serverHost);

        console.log("RocketChatHelper Connecting")

        Meteor.call('login', {
            "msg": "method",
            "method": "login",
            "id": "42",
            "params":[
                { "resume": "auth-token" }
            ]
        }, (error, result) => {
            if(error){
                console.log("RocketChatHelper login error : " + JSON.stringify(error))
            } else {
                console.log("RocketChatHelper login ok")
            }
        });

        console.log("Meteor.status() : " + JSON.stringify(Meteor.status()))
    }
}

export default RocketChatHelper