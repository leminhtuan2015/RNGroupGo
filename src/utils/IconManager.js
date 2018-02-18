import React, { Component } from 'react';
import {Image}from "react-native"
//import {Icon,} from 'react-native-elements'
//import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


class IconManager {
  static icon(name, color = "green",
    onPress = (() => {}), size = 30, underlayColor = "transparent"){
    let icon = <FontAwesome 
        name={name}
        size={size}
        color={color}
        underlayColor={underlayColor}
        backgroundColor={"white"}
        onPress={() => {onPress()}} />

    return icon  
  }   
}

export default IconManager
