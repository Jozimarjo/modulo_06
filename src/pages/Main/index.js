import React, { Component } from 'react';
// import { View } from 'react-native';
import { Keyboard, ActivityIndicator } from 'react-native';
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
    state = {
        newUser: '',
        loading: false,
        users: [],
    };

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
        this.setState({
            users: [...users, data],
            newUser: '',
            loading: false,
        });
        Keyboard.dismiss();
    };
    render() {
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
                            <ProfileButton onPress={() => {}}>
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

Main.navigationOptions = {
    title: 'Usuarios',
};
