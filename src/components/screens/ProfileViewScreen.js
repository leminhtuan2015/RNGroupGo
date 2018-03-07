import React from 'react';
import {
    View,
    Text, StyleSheet,
} from "react-native"

import {
    Button
} from "react-native-elements"

import * as ActionTypes from "../../constants/ActionTypes"
import FirebaseAuthHelper from "../../helpers/FirebaseAuthHelper";

class ProfileViewScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    renderLoginButtons = () => {
        return (
            <View>
                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_FACEBOOK_LOGIN})}}
                    raised
                    backgroundColor="#385691"
                    icon={{name: "facebook", type: "font-awesome"}}
                    title="Login With Facebook" />

                <Text />

                <Button
                    raised
                    backgroundColor="#DB4D40"
                    icon={{name: "google", type: "font-awesome"}}
                    title="Login With Google" />
            </View>
        )
    }

    renderUser = () => {
        return(
            <View>
                <Text>{this.props.store.profileState.currentUser.displayName}</Text>
                <Text />
                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_USER_LOGOUT})}}
                    raised
                    backgroundColor="#DB4D40"
                    title="Logout" />
            </View>
        )

    }

    render = () => {
        console.log("render ProfileViewScreen")

        return (
            <View style={styles.container}>
                {(this.props.store.profileState.currentUser != null) ?
                    this.renderUser() : this.renderLoginButtons()
                }
            </View>
        )
    }

    componentDidMount = () => {
        this.props.dispatch({type: ActionTypes.PROFILE_GET_CURRENT_USER})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
    },

});

export default ProfileViewScreen




