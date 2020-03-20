import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

export default class Repository extends Component {
    render() {
        const { navigation } = this.props;
        const url = navigation.getParam('item');
        console.tron.log('comp ', navigation.getParam('item'));
        return <WebView originWhitelist={['*']} source={{ uri: url }} />;
    }
}
