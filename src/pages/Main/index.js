import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
    Container,
    Form,
    Input,
    SubmitButton,
    List,
    User,
    Avatar,
    ProfileButton,
    ProfileButtonText,
    Name,
    Bio,
} from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

export default class Main extends Component {
    static navigationOptions = {
        title: 'Usuarios',
    };
    static propTypes = {
        navigation: PropTypes.shape({
            navigate: PropTypes.func,
        }).isRequired,
    };
    state = {
        newUser: '',
        loading: false,
        users: [],
    };

    async componentDidMount() {
        const users = await AsyncStorage.getItem('users');

        if (users) {
            this.changeState(users);
        }
    }

    changeState(users) {
        this.setState({ users: JSON.parse(users) });
    }

    async componentDidUpdate(_, prevState) {
        const { users } = this.state;
        if (prevState.users !== users) {
            await AsyncStorage.setItem('users', JSON.stringify(users));
        }
    }

    handleAddUser = async () => {
        const { users, newUser } = this.state;
        this.setState({ loading: true });
        const response = await api.get(`/users/${newUser}`);
        const data = {
            name: response.data.name,
            login: response.data.login,
            bio: response.data.bio,
            avatar: response.data.avatar_url,
        };
        console.tron.log(data);

        this.setState({
            users: [...users, data],
            newUser: '',
            loading: false,
        });
        Keyboard.dismiss();
    };
    handleNavigate = user => {
        const { navigation } = this.props;
        navigation.navigate('User', { user });
    };
    render() {
        console.tron.log('data');

        const { users, newUser, loading } = this.state;
        return (
            <Container>
                <Form>
                    <Input
                        autoCorrect={false}
                        autoCaptalize="none"
                        placeholder="Adicionar usuario"
                        value={newUser}
                        onChangeText={text => this.setState({ newUser: text })}
                        returnKeyType="send"
                        onSubmitEditing={this.handleAddUser}
                    />
                    <SubmitButton
                        loading={loading}
                        onPress={this.handleAddUser}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Icon name="add" size={20} color="#FFF" />
                        )}
                    </SubmitButton>
                </Form>

                <List
                    data={users}
                    keyExtractor={user => user.login}
                    renderItem={({ item }) => (
                        <User>
                            <Avatar source={{ uri: item.avatar }} />
                            <Name>{item.name}</Name>
                            <Bio> {item.bio} </Bio>
                            <ProfileButton
                                onPress={() => this.handleNavigate(item)}
                            >
                                <ProfileButtonText>
                                    Ver Perfil
                                </ProfileButtonText>
                            </ProfileButton>
                        </User>
                    )}
                />
            </Container>
        );
    }
}
