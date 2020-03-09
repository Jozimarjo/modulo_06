import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
});

function App() {
    return (
        <>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step testereac</Text>
            </View>
        </>
    );
}

export default App;
