import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native"

import {
    Button
} from "react-native-elements"

import * as ActionTypes from "../../constants/ActionTypes"

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
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_GOOGLE_LOGIN})}}
                    raised
                    backgroundColor="#DB4D40"
                    icon={{name: "google", type: "font-awesome"}}
                    title="Login With Google" />
            </View>
        )
    }

    renderUser = () => {
        return(
            <View style={styles.container}>
                <Image
                    style={styles.roundImage}
                    source={{uri: this.props.store.userState.currentUser.photoURL}}
                />

                <Text />

                <Text style={styles.userName}>
                    {this.props.store.userState.currentUser.displayName}
                </Text>

                <Text />

                <Button
                    onPress={() => {this.props.dispatch({type: ActionTypes.SAGA_USER_LOGOUT})}}
                    raised
                    backgroundColor="#DB4D40"
                    title="Logout" />
            </View>
        )

    }

    componentWillReceiveProps = (newProps) => {
        console.log("ProfileView will receive props : " + JSON.stringify(newProps))
    }

    render = () => {
        console.log("render_x ProfileViewScreen")

        return (
            <View style={styles.container}>
                {(this.props.store.userState.currentUser != null) ?
                    this.renderUser() : this.renderLoginButtons()
                }
            </View>
        )
    }

    componentDidMount = () => {
        console.log("PROFILE componentDidMount")

        this.props.dispatch({type: ActionTypes.SAGA_GET_CURRENT_USER})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
    },

    roundImage: {
        height: 160,
        width: 160,
        borderRadius: 80,
    },

    userName: {
        fontSize: 30,
    },

});

export default ProfileViewScreen




