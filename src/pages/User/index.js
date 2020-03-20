import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import {
    Container,
    Header,
    Name,
    Bio,
    Avatar,
    Stars,
    Starred,
    Info,
    Title,
    Author,
    OwnerAvatar,
} from './styles';

import { ProfileButton, ProfileButtonText } from '../Main/styles';
import api from '../../services/api';

// import { Container } from './styles';

export default class User extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').name,
    });

    static propTypes = {
        navigation: PropTypes.shape({
            getParam: PropTypes.func,
        }).isRequired,
    };

    state = {
        stars: [],
        refreshing: false,
        page: 1,
        loading: false,
    };
    async componentDidMount() {
        const { navigation } = this.props;

        const { page } = this.state;

        const user = navigation.getParam('user');

        this.setState({ loading: true });

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                per_page: 5,
                page,
            },
        });

        this.setState({ stars: response.data, loading: false, page: page + 1 });
    }

    loadMore = async () => {
        const { navigation } = this.props;

        const { stars, page } = this.state;

        const user = navigation.getParam('user');

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                per_page: 5,
                page: page + 1,
            },
        });
        this.setState({
            stars: [...stars, ...response.data],
            loading: false,
            page: page + 1,
        });
    };

    refreshList = async () => {
        const { navigation } = this.props;

        const { page } = this.state;

        const user = navigation.getParam('user');
        this.setState({ loading: true });

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                per_page: 30,
                page: 1,
            },
        });

        this.setState({
            stars: response.data,
            loading: false,
            page: page + 1,
        });
    };

    handleNavigate = () => {
        console.tron.log('handle foi chamado == ');
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading } = this.state;
        const user = navigation.getParam('user');
        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio> {user.bio} </Bio>
                </Header>
                <ProfileButton onPress={this.handleNavigate}>
                    <ProfileButtonText>Ver teste</ProfileButtonText>
                </ProfileButton>
                {loading ? (
                    <ActivityIndicator color="#7159c1" />
                ) : (
                    <Stars
                        onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
                        refreshing={this.state.loading}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        renderItem={({ item }) => (
                            <Starred onPress={this.handleNavigate}>
                                <OwnerAvatar
                                    onPress={this.handleNavigate}
                                    source={{ uri: item.owner.avatar_url }}
                                />
                                <Info onPress={this.handleNavigate}>
                                    <Title> {item.name} </Title>
                                    <Author> {item.owner.login} </Author>
                                </Info>
                                <ProfileButton
                                    onPress={() =>
                                        navigation.navigate('Repository', {
                                            item: item.html_url,
                                        })
                                    }
                                >
                                    <ProfileButtonText>
                                        Ver teste
                                    </ProfileButtonText>
                                </ProfileButton>
                            </Starred>
                        )}
                    />
                )}
            </Container>
        );
    }
}
