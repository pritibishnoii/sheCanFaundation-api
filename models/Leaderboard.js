import mongoose from 'mongoose';
const leaderboardSchema = new mongoose.Schema({
    name: String,
    donations: Number,
});

export default mongoose.model('Leaderboard', leaderboardSchema);
