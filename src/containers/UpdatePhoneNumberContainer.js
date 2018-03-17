import React, {Component} from 'react';
import {connect} from 'react-redux';

import UpdatePhoneNumberView from '../components/screens/UpdatePhoneNumberViewScreen';

const mapStateToProps = (store) => ({
    store: store,
})

const UpdatePhoneNumberContainer = connect(mapStateToProps)(UpdatePhoneNumberView)

export default UpdatePhoneNumberContainer
