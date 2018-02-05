import React, { Component } from 'react';
import { Button } from 'react-native-elements'
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

class TextView extends Component {

  view = (
    <View style={styles.container}>
      <FormLabel>Name</FormLabel>
      <FormValidationMessage>Error message</FormValidationMessage>
    </View>
  )

 render() {
    return this.view
  }
}

 var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 30,
    paddingTop: 20
  },
  button: {
    alignItems: 'center',
    padding: 10,
    marginTop: 10,

  },
})

export default TestView


