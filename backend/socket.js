

let players = {}; // roomId: [socket1, socket2]
let waitingQueue = [];

function initSocket(io) {

  io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('findMatch', () => {
      console.log("one player is finding match");
      console.log(socket.id);
      
      
      waitingQueue.push(socket);

      if (waitingQueue.length >= 2) {
        const player1 = waitingQueue.shift(); // remove first player
        const player2 = waitingQueue.shift(); // remove second player

        const roomId = `${player1.id}#${player2.id}`;
        console.log(roomId);
        
        player1.join(roomId);
        player2.join(roomId);

        io.to(roomId).emit('startGame', {
          roomId,
          players: [player1.id, player2.id]
        });
      } else {
        socket.emit('waitingForOpponent');
      }
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Clean waitingQueue
      waitingQueue = waitingQueue.filter(s => s.id !== socket.id);

      // Clean players map
      for (const room in players) {
        players[room] = players[room].filter(id => id !== socket.id);
        if (players[room].length === 0) delete players[room];
      }
    });



    socket.on('createRoom', (roomId) => {
      socket.join(roomId);
      players[roomId] = [socket.id];
      io.to(socket.id).emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId) => {
      if (players[roomId]?.length < 2) {
        socket.join(roomId);
        players[roomId].push(socket.id);
        io.to(roomId).emit('startGame', {
          roomId,
          players: players[roomId]
        });
      } else if(players[roomId]?.length === 2) {
        socket.emit('roomFull', { message: 'room full' });
      }else{
        socket.emit('roomFull', { message: 'room is not available' });
      }
    });


    socket.on('makeMove', ({ roomId, board, currentTurn }) => {      
      socket.to(roomId).emit('moveMade', { board, currentTurn });
    });

    socket.on('cancelMatch', ({ roomId }) => {
      console.log(`Player ${socket.id} canceled match in room ${roomId}`);

      // Remove from waiting queue
      waitingQueue = waitingQueue.filter(s => s.id !== socket.id);

      if (players[roomId]) {
        // Remove the player from the room
        players[roomId] = players[roomId].filter(id => id !== socket.id);

        // If no players left OR only one, delete the room
        if (players[roomId].length < 2) {
          delete players[roomId];
        }
      }
      socket.leave(roomId);
    });


  });

}

export default initSocket 
