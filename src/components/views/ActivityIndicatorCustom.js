import React from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
} from "react-native"

import {
    RotationHoleLoader,
    ColorDotsLoader,
    BubblesLoader
} from 'react-native-indicator'

class ActivityIndicatorCustom extends React.Component {

    render() {
        return (
            <View style={styles.center}>
                <BubblesLoader
                />
            </View>
        )
    }
}

export default ActivityIndicatorCustom

const styles = StyleSheet.create({
    center: {
        zIndex: 1000,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
})