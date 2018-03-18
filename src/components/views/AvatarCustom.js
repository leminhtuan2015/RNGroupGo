import React, {Component} from 'react'
import {View, Image, StyleSheet} from 'react-native'
import IconManager from "../../utils/IconManager"
import FirebaseHelper from "../../helpers/FirebaseHelper";

class AvatarCustom extends React.Component {

    static ONLINE_STATUS = "1"
    static OFFLINE_STATUS = "0"
    static ONLINE_COLOR = "#00C853"
    static OFFLINE_COLOR = "#9E9E9E"

    constructor(props) {
        super(props)

        this.state = {statusColor: AvatarCustom.ONLINE_COLOR}
        this.subscribe(this.props.userId)
    }

    subscribe = (userId) => {
        if (userId == null) {
            return
        }

        let path = "users/" + userId + "/status"

        FirebaseHelper.observe(path, (data) => {
            if (!data) {
                return
            }

            console.log("users : " + userId + " : " + JSON.stringify(data))

            if(data == AvatarCustom.ONLINE_STATUS){
                this.setState({statusColor: AvatarCustom.ONLINE_COLOR})
            } else if (data == AvatarCustom.OFFLINE_STATUS){
                this.setState({statusColor: AvatarCustom.OFFLINE_COLOR})
            }

        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.roundImage}
                    source={{uri: this.props.uri}}
                />

                <View style={styles.statusImage}>
                    {IconManager.icon("circle", 18, this.state.statusColor, "#00C853", () => {
                    })}
                </View>
            </View>
        )
    }
}


export default AvatarCustom

const styles = StyleSheet.create({
    container: {},

    roundImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },

    statusImage: {
        marginTop: -15,
        alignSelf: 'flex-end',
    }
})