import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux';

import FriendView from '../components/screens/FriendViewScreen';

const mapStateToProps = (store) => ({
    store: store,
})

const FriendViewContainer = connect(mapStateToProps)(FriendView)

export default FriendViewContainer
