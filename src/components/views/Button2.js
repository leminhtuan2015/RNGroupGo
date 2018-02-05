import React, { Component } from 'react'
import { Button, Alert } from 'react-native'

class Button2 extends Component {
    handlePress = () => {
        Alert.alert('You tapped the : ' + (this.props.title || ""));
    }
    
    render() {
      return (
        <Button
            onPress = {this.handlePress}
            title = {this.props.title || "Btn2"}
            color = "red"
        />    
      )
    }
}
export default Button2
