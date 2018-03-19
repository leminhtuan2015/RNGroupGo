import React, {Component} from 'react';
import {connect} from 'react-redux';

import InviteFriendView from '../components/screens/InviteFriendViewScreen';

const mapStateToProps = (store) => ({
    store: store,
})

const InviteFriendViewContainer = connect(mapStateToProps)(InviteFriendView)

export default InviteFriendViewContainer
