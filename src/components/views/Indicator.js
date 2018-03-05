import {CirclesLoader, RippleLoader} from 'react-native-indicator';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Button,
    Image,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Alert,
} from "react-native"

var styles = StyleSheet.create({
    center: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

})

class Indicator extends React.Component {
    handlePress = () => {
    }

    render() {
        return (
            <View style={styles.center}>
                <RippleLoader
                    size={150}
                />
            </View>
        );
    }
}

export default Indicator
