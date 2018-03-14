import React from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
} from "react-native"

import {
    RotationHoleLoader,
    ColorDotsLoader
} from 'react-native-indicator'

class ActivityIndicatorCustom extends React.Component {

    render() {
        return (
            <View style={styles.center}>
                <ColorDotsLoader
                />
            </View>
        )
    }
}

export default ActivityIndicatorCustom

const styles = StyleSheet.create({
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