import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  winner: { type: String }, 
  date: { type: Date, default: Date.now }
});

const Match = mongoose.model('Match', matchSchema);

export default Match
