import React, { Component } from 'react'
import { Button, Alert } from 'react-native'

const Button1 = (props) => {
    const handlePress = () => {
        Alert.alert('You tapped the :' + props.title);
    }
    
    return (
        <Button
            onPress = {handlePress}
            title = {props.title}
            color = "red"
        />    
    )
}
export default Button1
