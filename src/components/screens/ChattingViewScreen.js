import React, {Component} from 'react';
import Modal from "react-native-modal";
import {
    Alert,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    // Flex to fill, position absolute,
    // Fixed left/top, and the width set to the window width
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
    }
});

class ChattingScreen extends Component<> {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        return {
            tabBarLabel: 'Contacts',
            drawerLabel: 'Contacts',
            headerTitle: 'Chatting',
            headerBackTitle: '',
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            isModalVisible: this.props.isModalVisible,
        }
    }

    render() {
        return (
            <View style={styles.overlay}>
                <Text>123</Text>
            </View>
        )
    }
}

export default ChattingScreen
