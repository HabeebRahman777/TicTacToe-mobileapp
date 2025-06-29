import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ComputerGameScreen({ navigation }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isMyTurn && !gameOver) {
      setTimeout(makeComputerMove, 700); // Simulate delay
    }
  }, [isMyTurn]);

  const handleMove = (index) => {
    if (!isMyTurn || board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    checkGameStatus(newBoard, 'X');
    setIsMyTurn(false);
  };

  const makeComputerMove = () => {
    const getAvailable = (b) =>
        b.map((val, idx) => (val === null ? idx : null)).filter((v) => v !== null);

    const tryMove = (b, index, symbol) => {
        const testBoard = [...b];
        testBoard[index] = symbol;
        return calculateWinner(testBoard) === symbol;
    };

    const available = getAvailable(board);

    // 1. Win if possible
    for (let idx of available) {
        if (tryMove(board, idx, 'O')) {
        return placeComputerMove(idx);
        }
    }

    // 2. Block player win
    for (let idx of available) {
        if (tryMove(board, idx, 'X')) {
        return placeComputerMove(idx);
        }
    }

    // 3. Pick center if available
    if (board[4] === null) {
        return placeComputerMove(4);
    }

    // 4. Pick a corner if available
    const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (corners.length > 0) {
        return placeComputerMove(corners[Math.floor(Math.random() * corners.length)]);
    }

    // 5. Otherwise pick any random available
    const randomIndex = available[Math.floor(Math.random() * available.length)];
    return placeComputerMove(randomIndex);
};

    const placeComputerMove = (index) => {
        const newBoard = [...board];
        newBoard[index] = 'O';
        setBoard(newBoard);
        checkGameStatus(newBoard, 'O');
        setIsMyTurn(true);
    };


  const checkGameStatus = (b, symbol) => {
    const winner = calculateWinner(b);
    if (winner) {
      setGameOver(true);
      Alert.alert('Game Over', winner === 'X' ? 'You Win!' : 'Computer Wins');
    } else if (!b.includes(null)) {
      setGameOver(true);
      Alert.alert('Game Over', 'It\'s a Draw');
    }
  };

  const calculateWinner = (b) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
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
      <Text style={styles.title}>Tic Tac Toe vs Computer</Text>
      <Text style={styles.turn}>
        {gameOver ? 'Game Over' : isMyTurn ? "Your Turn" : "Computer's Turn"}
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  turn: {
    fontSize: 18,
    marginBottom: 20,
    color: '#444',
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
