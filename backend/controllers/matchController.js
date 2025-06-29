import Match from '../models/Match.js'

export const getUserMatches = async (req, res) => {
  const { userId } = req.params;
  try {
    const matches = await Match.find({
      $or: [{ player1: userId }, { player2: userId }]
    }).populate('player1 player2');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};
