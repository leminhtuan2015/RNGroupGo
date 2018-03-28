import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';

import ChatViewScreen from '../components/screens/ChatViewScreen';

const mapStateToProps = (store) => ({
    store: store,
})

const ChatViewContainer = connect(mapStateToProps)(ChatViewScreen)

export default ChatViewContainer
