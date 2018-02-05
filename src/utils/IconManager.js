import React, { Component } from 'react';
import {Image}from "react-native"
//import {Icon,} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

class IconManager {
  static icon(name, color = "green", onPress = (() => {})){
    let icon = <Icon 
        name={name}
        size={30}
        color={color}
        underlayColor="transparent"
        onPress={() => {onPress()}} />

    return icon  
  }   
}

export default IconManager
