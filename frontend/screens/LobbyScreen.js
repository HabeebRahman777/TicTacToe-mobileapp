import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import socket from '../utils/socket';

export default function LobbyScreen({ navigation }) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [createdRoom, setCreatedRoom] = useState('');

  useEffect(() => {
    socket.connect();

    socket.on('waitingForOpponent', () => {
      setIsWaiting(true);
    });

    socket.on('startGame', ({ roomId, players }) => {
      setIsWaiting(false);
      navigation.navigate('Game', { roomId, players, mySocketId: socket.id });
    });

    socket.on('roomCreated', (roomId) => {
      setCreatedRoom(roomId);
      Alert.alert('Room Created', `Share this Room ID: ${roomId}`);
      setIsWaiting(true);
    });

    socket.on('roomFull', ({message}) => {
      Alert.alert('Room Error', message);
    });

    return () => {
      socket.off('waitingForOpponent');
      socket.off('startGame');
      socket.off('roomCreated');
      socket.off('roomFull');
    };
  }, []);

  const handleCancelMatch = () => {
    socket.emit('cancelMatch', { roomId }); // Optional: let backend know to remove from queue
    setIsWaiting(false);
    navigation.goBack(); // Or navigate to a specific screen
  };

  const handleFindMatch = () => {
    socket.emit('findMatch');
    setIsWaiting(true);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    socket.emit('createRoom', newRoomId);
  };

  const handleJoinRoom = () => {
    if (!roomId) return Alert.alert('Error', 'Enter a valid Room ID');
    socket.emit('joinRoom', roomId);
    setIsWaiting(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe Lobby</Text>

      {isWaiting ? (
        <>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.waitText}>
            {createdRoom ? `Waiting for opponent in Room: ${createdRoom}` : 'Waiting for opponent...'}
          </Text>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancelMatch} color="#FF3B30" />
          </View>
        </>
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button title="Play vs Computer" onPress={() => navigation.navigate('ComputerGame')} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Find Online Match" onPress={handleFindMatch} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Create Friend Match" onPress={handleCreateRoom} />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={showRoomInput ? "Join Friend Match" : "Enter Room Code"}
              onPress={() => {
                if (showRoomInput) handleJoinRoom();
                else setShowRoomInput(true);
              }}
            />
            {showRoomInput && (
              <TextInput
                style={styles.input}
                placeholder="Enter Room Code"
                value={roomId}
                onChangeText={setRoomId}
              />
            )}
          </View>
        </>
      )}
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
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
    width: '100%',
    textAlign: 'center',
  },
});
