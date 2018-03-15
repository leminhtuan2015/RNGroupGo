import React, {Component} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


class IconManager {
    static icon(name,
                size = 30,
                color = "green",
                underlayColor = "transparent",
                onPress = (() => {
                })) {

        let icon = <FontAwesome
            name={name}
            size={size}
            color={color}
            underlayColor={underlayColor}
            backgroundColor={"white"}
            onPress={() => {
                onPress()
            }}/>

        return icon
    }

    static ionIcon(name,
                size = 30,
                color = "green",
                underlayColor = "transparent",
                onPress = (() => {
                })) {

        let icon = <Ionicons
            name={name}
            size={size}
            color={color}
            underlayColor={underlayColor}
            backgroundColor={"white"}
            onPress={() => {
                onPress()
            }}/>

        return icon
    }

}

export default IconManager
