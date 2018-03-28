const serverHost = "192.168.1.6";
const serverPort = 3000;
const authToken = "WTSr59QZg1iZ-E1ZzUZpG0Bcp0PgQhIpJG50torh7LW";
const subscribe = "GENERAL";

process.env.METEOR_TOKEN = authToken;

class RocketChatSubscription {

    static subscribe() {
        console.log("RocketChatSubscription Connecting")
    }
}

export default RocketChatSubscription