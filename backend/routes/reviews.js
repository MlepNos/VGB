// routes/reviews.js
const express = require("express");
const router = express.Router();
const { sql, pool } = require("../controller/connect");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Get all reviews for a game
router.get("/:gameId", async (req, res) => {
  const { gameId } = req.params;
  try {
    const result = await pool.request()
      .input("gameId", sql.Int, gameId)
      .query("SELECT * FROM reviews WHERE game_id = @gameId ORDER BY created_at DESC");
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews", message: err.message });
  }
});

router.post("/:gameId", verifyToken, async (req, res) => {
  const { gameId } = req.params;
  const { comment, score } = req.body;
  const reviewer_name = req.user.username;

  try {
    const check = await pool.request()
      .input("gameId", sql.Int, gameId)
      .input("reviewer_name", sql.VarChar, reviewer_name)
      .query("SELECT * FROM reviews WHERE game_id = @gameId AND reviewer_name = @reviewer_name");

    if (check.recordset.length > 0) {
      // Review exists → update
      await pool.request()
        .input("gameId", sql.Int, gameId)
        .input("reviewer_name", sql.VarChar, reviewer_name)
        .input("comment", sql.Text, comment)
        .input("score", sql.Int, score)
        .query(`
          UPDATE reviews 
          SET comment = @comment, score = @score, created_at = GETDATE()
          WHERE game_id = @gameId AND reviewer_name = @reviewer_name
        `);
      return res.status(200).json({ message: "Review updated" });
    }

    // New review
    await pool.request()
      .input("gameId", sql.Int, gameId)
      .input("reviewer_name", sql.VarChar, reviewer_name)
      .input("comment", sql.Text, comment)
      .input("score", sql.Int, score)
      .query(`
        INSERT INTO reviews (game_id, reviewer_name, comment, score)
        VALUES (@gameId, @reviewer_name, @comment, @score)
      `);

    res.status(201).json({ message: "Review submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review", message: err.message });
  }
});


// Delete a review
router.delete("/delete/:reviewId", verifyToken, async (req, res) => {
  const { reviewId } = req.params;
  try {
    await pool.request()
      .input("reviewId", sql.Int, reviewId)
      .query("DELETE FROM reviews WHERE id = @reviewId");
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review", message: err.message });
  }
});

// Admin-only: Set VGB score for a game
router.post("/vgb-score/:gameId", verifyToken, isAdmin, async (req, res) => {
  const { gameId } = req.params;
  const { score } = req.body;

  try {
    await pool.request()
      .input("score", sql.Float, score)
      .input("id", sql.Int, gameId)
      .query("UPDATE games SET vgb_score = @score WHERE id = @id");
    res.status(200).json({ message: "VGB Score updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to set VGB score", message: err.message });
  }
});


module.exports = router;
