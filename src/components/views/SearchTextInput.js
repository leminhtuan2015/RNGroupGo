import React, {Component,} from 'react';
import {
    FormInput,
} from 'react-native-elements'


class SearchTextInput extends Component {

    constructor() {
        super()

        this.state = {
            timeout: null
        }
    }

    render() {
        let {onPauseText, pauseDelay, onChangeText} = this.props
        let {timeout} = this.state

        return (
            <FormInput
                inputStyle={{color: "#2196f3", marginLeft: 10}}
                // containerStyle={{backgroundColor: "#fafafa", borderRadius: 25}}
                onChangeText={(text) => {
                    if (onPauseText) {
                        if (timeout) window.clearTimeout(timeout)
                        timeout = window.setTimeout(() => onPauseText(text), pauseDelay)
                        this.setState({timeout})
                    }
                    if (onChangeText) onChangeText(text)
                }}

                placeholder="Search"
                autoFocus={true}
                autoCorrect={false}
                autoCapitalize="none"
                defaultValue=""/>
        )
    }

}


SearchTextInput.defaultProps = {
    pauseDelay: 1000
}

export default SearchTextInput