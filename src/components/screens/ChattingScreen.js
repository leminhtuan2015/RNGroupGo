import React, { Component } from 'react';
import Modal from "react-native-modal";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  ImageBackground, 
  ActivityIndicator,
	TouchableOpacity,
} from 'react-native';


class ChattingScreen extends Component<{}> {

  constructor(props){
    super(props)

    this.state = {
      isModalVisible: this.props.isModalVisible,
    }
  }

  toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

	render () {
    return (
      <View>
        <Modal isVisible={this.props.isModalVisible && this.state.isModalVisiable}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={this.toggleModal}>
              <Text>Hide me!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

export default ChattingScreen
