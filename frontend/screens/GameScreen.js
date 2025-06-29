import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert,Button } from 'react-native';
import socket from '../utils/socket';

export default function GameScreen({ route, navigation }) {
  const { roomId, players, mySocketId } = route.params;

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentSymbol, setCurrentSymbol] = useState('X');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const myIndex = players.indexOf(mySocketId);
    setIsMyTurn(myIndex === 0);
    setCurrentSymbol(myIndex === 0 ? 'X' : 'O');

    socket.on('moveMade', ({ board: newBoard, currentTurn }) => {
      
      setBoard(newBoard);
      setIsMyTurn(currentTurn === mySocketId);
      checkGameStatus(newBoard);
    });
  }, []);

  const handleMove = (index) => {
  if (!isMyTurn || board[index] || gameOver) return;

  const newBoard = [...board];
  newBoard[index] = currentSymbol;
  setBoard(newBoard);
  setIsMyTurn(false); 

  const nextPlayerId = players.find(id => id !== mySocketId); 

  socket.emit('makeMove', {
    roomId,
    board: newBoard,
    currentTurn: nextPlayerId 
  });

  checkGameStatus(newBoard);
};


const checkGameStatus = (b) => {
  if (gameOver) return;

  const winner = calculateWinner(b);

  if (winner) {
    setGameOver(true);
    
    // Delay to ensure render cycle completes before alert
    setTimeout(() => {
      Alert.alert('Game Over', winner === currentSymbol ? 'You Win!' : 'You Lose');
    }, 100);
    
  } else if (!b.includes(null)) {
    setGameOver(true);
    
    setTimeout(() => {
      Alert.alert('Game Over', 'It\'s a Draw');
    }, 100);
  }
};


  const calculateWinner = (b) => {
    const lines = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  };

  const renderCell = (index) => (
    <TouchableOpacity
      key={index}
      style={styles.cell}
      onPress={() => handleMove(index)}
    >
      <Text style={styles.cellText}>{board[index]}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.turn}>
        {gameOver ? 'Game Finished' : isMyTurn ? "Your Turn" : "Opponent's Turn"}
      </Text>

      <View style={styles.grid}>
        {board.map((_, index) => renderCell(index))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  turn: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  grid: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  cellText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
});
