import {CirclesLoader, RippleLoader} from 'react-native-indicator';
import React from 'react';
import {
    StyleSheet,
    View,
} from "react-native"

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

class Indicator extends React.Component {
    handlePress = () => {
    }

    render() {
        return (
            <View style={this.props.style}>
                <RippleLoader
                    size={200}
                />
            </View>
        );
    }
}

export default Indicator
