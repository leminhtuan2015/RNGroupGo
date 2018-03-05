import React, {Component} from 'react';
import {
    Button,
    Icon,
} from 'react-native-elements'

import * as ActionTypes from "../../constants/ActionTypes"
import {styleStackHeader} from "../../utils/Constant.js"
import Place from "../../models/Place"

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
} from 'react-native';


class DetailView extends Component<> {
    state = {}

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;

        this.headerRight =
            <Icon
                name="add"
                size={30}
                underlayColor="transparent"
                color='#ffffff'
                onPress={params.rightButtonOnPress ? params.rightButtonOnPress : () => null}/>

        return {
            tabBarLabel: 'Home',
            headerTitle: '',
            title: 'Place',
            headerTintColor: 'white',
            headerStyle: styleStackHeader,
            headerRight: this.headerRight
        }
    }

    constructor(props) {
        super(props);

        this.bind()
    }

    bind = () => {
        this.props.navigation
            .setParams({rightButtonOnPress: this.rightButtonOnPress});
    }

    rightButtonOnPress = () => {
        console.log("Right button Pressed")

        if (this.props.navigation.state.routeName == "TabStackPlaceScreen") {
            this.props.navigation.navigate('TabStackAddPlaceScreen')
        } else if (this.props.navigation.state.routeName == "PlaceView") {
            this.props.navigation.navigate('AddPlaceView')
        }
    }

    onPressButton = (place) => {
        console.log("press: " + place.city)

        this.props.dispatch({
            type: ActionTypes.GET_WEATHER_DATA,
            data: {city: place.city, countryCode: place.countryCode}
        })

        this.props.navigation.goBack()
    }

    editButtonPress = () => {
        console.log("press")
        this.props.navigation.navigate('EditView')
    }

    confirmDeleteItem = (placeId) => {
        Alert.alert(
            'Delete Item', 'You will delete this item?',
            [
                {
                    text: 'Delete', onPress: () => {
                        console.log("Delete : " + placeId)
                        this.props.dispatch({type: ActionTypes.DELETE_PLACE, data: placeId})
                    }
                },
                {text: 'Not Delete', onPress: () => console.log('Not Delete Pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            {cancelable: false}
        )
    }

    itemView = (place) => {
        return (
            <TouchableHighlight
                onPress={() => {
                    this.onPressButton(place)
                }}
                onLongPress={() => {
                    this.confirmDeleteItem(place.id)
                }}
                underlayColor="gray" key={place.city}>
                <View id="item" style={styles.item}>
                    <Text style={styles.itemText}>{place.city}</Text>
                    <Text style={styles.itemText}>{place.temp}°</Text>
                </View>
            </TouchableHighlight>
        )
    }

    placeViews = () => {
        let places = this.props.store.placeState.places

        let views = places.map((place) => {
            return this.itemView(place)
        })
        return views
    }

    componentDidMount() {
        this.props.dispatch({type: ActionTypes.SET_PLACE_LOADING})
        this.props.dispatch({type: ActionTypes.GET_PLACES})
    }

    render() {
        return (
            <View id="container" style={styles.container}>
                <ImageBackground
                    source={require('../../resources/images/background_3.jpg')}
                    style={styles.backgroundImage}>
                    <View id="contentContainer" style={styles.contentContainer}>
                        {this.props.store.placeState.isLoading &&
                        (<ActivityIndicator size="large"
                                            color="#ffffff" style={styles.loading}/>)
                        }
                        <ScrollView>
                            {this.placeViews()}
                        </ScrollView>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    itemText: {
        color: "#fff",
        fontSize: 30,
    },

    item: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },

    contentContainer: {
        flex: 1,
        marginTop: 70,
    },

    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

})

export default DetailView
