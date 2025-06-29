import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { io } from 'socket.io-client';
import socket from '../utils/socket';

export default function LobbyScreen({ navigation }) {
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
      socket.connect();
      socket.on('waitingForOpponent', () => {
      console.log('Waiting for a second player...');
      setIsWaiting(true); 
    });

    socket.on('startGame', ({ roomId, players }) => {
      console.log('Game started in room:', roomId);
      setIsWaiting(false); 
      navigation.navigate('Game', { roomId, players,mySocketId: socket.id });
    });

    return () => {
      socket.off('waitingForOpponent');
      socket.off('startGame');
    };
  }, []);

  const handleFindMatch = () => {
    socket.emit('findMatch');
    setIsWaiting(true); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe Lobby</Text>

      {isWaiting ? (
        <>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.waitText}>Searching for an opponent...</Text>
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Find Online Match" onPress={handleFindMatch} />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Create Friend Match" onPress={() => {}} disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  waitText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
