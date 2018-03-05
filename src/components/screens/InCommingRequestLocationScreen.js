import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Button } from 'react-native-elements'

import Indicator from "../views/Indicator"

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
        flexDirection: 'row',
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

class InCommingRequestLocationScreen extends Component<> {

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
        }

        this.callback = null
    }

    render(){
        return(
            <View style={styles.container} >
                <View style={styles.top}>
                    <Text style={styles.titleText}>In Comming Call</Text>
                </View>

                {this.state.isShowingIndicator && <Indicator style={styles.center}/>}

                <View style={styles.bottom}>
                    <Button
                        raised={true}
                        rounded={true}
                        onPress={() => {this.rejected()}}
                        title="Cancel"
                        borderRadius={5}
                        color="white"
                        backgroundColor="#C62828"
                        buttonStyle={{width: 100, height: 50, alignItems: "center"}}
                    />

                    <Button
                        raised={true}
                        rounded={true}
                        onPress={() => {this.ok()}}
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

    componentDidMount() {
        this.callback = this.props.navigation.state.params.callback
    }

    ok = () => {
        this.callback(true)
    }

    rejected = () => {
        this.callback(false)
        this.props.navigation.goBack()
    }
}

export default InCommingRequestLocationScreen