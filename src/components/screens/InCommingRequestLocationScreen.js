import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import {Button} from 'react-native-elements'
import Indicator from "../views/Indicator"

class InCommingRequestLocationScreen extends Component<> {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            headerLeft: null,
        }
    };

    constructor(props) {
        super(props)

        this.callback = this.props.navigation.state.params.callback
        this.friendId = this.props.navigation.state.params.friendId


    }

    componentDidMount = () => {
        console.log("InCommingRequestLocationScreen componentDidMount")

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.titleText}>In Comming Call</Text>
                    <Text>{this.friendId}</Text>
                </View>

                <View style={styles.center}>
                    <Image
                        style={[styles.roundImage]}
                        source={{uri: "https://static.pexels.com/photos/658687/pexels-photo-658687.jpeg"}}
                    />

                    <Indicator style={styles.center}/>
                </View>

                <View style={styles.bottom}>
                    <Button
                        raised={true}
                        rounded={true}
                        onPress={() => {
                            this.rejected()
                        }}
                        title="Cancel"
                        borderRadius={5}
                        color="white"
                        backgroundColor="#C62828"
                        buttonStyle={{width: 100, height: 50, alignItems: "center"}}
                    />

                    <Button
                        raised={true}
                        rounded={true}
                        onPress={() => {
                            this.accepted()
                        }}
                        title="OK"
                        borderRadius={5}
                        color="white"
                        backgroundColor="#4CAF50"
                        buttonStyle={{width: 100, height: 50, alignItems: "center"}}
                    />
                </View>
            </View>
        )
    }

    accepted = () => {
        this.callback(true)
        this.props.navigation.goBack()
    }

    rejected = () => {
        this.callback(false)
        this.props.navigation.goBack()
    }
}

export default InCommingRequestLocationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 5,
    },

    top: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center'
    },

    center: {
        flex: 0.8,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    bottom: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    roundImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
    },
})