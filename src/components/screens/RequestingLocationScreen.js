import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button } from 'react-native-elements'

import Indicator from "../views/Indicator"
import MessageService from "../../services/MessageService"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 5,
    },

    center: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    top: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center'
    },

    bottom: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:10,
    },

    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }
})

class RequestingLocationScreen extends Component<> {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            headerLeft: null,
        }
    };

    constructor(props){
        super(props)

        this.state = {
            isShowingIndicator: true,
            userId: null,
            channelId: null,
        }

        this.messageService = new MessageService(this)
    }

    render(){
        return(
            <View style={styles.container} >
                <View style={styles.top}>
                    <Text style={styles.titleText}>Calling</Text>
                    <Text>{this.state.userId}</Text>
                </View>

                {this.state.isShowingIndicator && <Indicator style={styles.center}/>}

                <View style={styles.bottom}>
                    <Button
                        raised={true}
                        rounded={true}
                        onPress={() => {this.stopCalling()}}
                        title="Cancel"
                        borderRadius={5}
                        color="white"
                        backgroundColor="#C62828"
                        buttonStyle={{width: 100, height: 50, alignItems: "center"}}
                    />
                </View>
            </View>
        )
    }

    componentDidMount() {
        this.bind()
    }

    stopCalling = () => {
        this.messageService.unSubscribeChannel({channelId: this.state.channelId})
        this.props.navigation.goBack()
    }

    bind = () => {
        const userId = this.props.navigation.state.params.userId
        console.log("userId : " + userId)
        let channelId = this.messageService.requestFriendLocation(userId)
        this.setState({userId: userId, channelId: channelId})
    }

    friendRejected = () => {
        this.props.navigation.goBack()
    }

}

export default RequestingLocationScreen