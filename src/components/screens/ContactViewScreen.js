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
} from "react-native"

import { 
  Icon,
} from 'react-native-elements'


class ContactViewScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Contacts',
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back"
      />
    );
  }
}


export default ContactViewScreen


