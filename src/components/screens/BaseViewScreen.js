import React from "react";
import NavBarItem from "../views/NavBarItem"

class BaseViewScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state

        let headerTitle = params.headerTitle

        const headerLeft =
            <NavBarItem
                iconName="md-close"
                color="gray"
                onPress={() => {
                    navigation.goBack()
                }}/>

        return {
            headerTitle: headerTitle,
            drawerLabel: '',
            tabBarLabel: '',
            headerLeft: headerLeft,
        }
    }

    constructor(props) {
        super(props)
    }

}

export default BaseViewScreen