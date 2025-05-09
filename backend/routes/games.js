const express = require("express");
const router = express.Router();
const axios = require("axios");

const {
    getAllGames,sql,pool
    /*
    
  registerUser,
  createPost,
  addComment,
  addLike,
  removeLike,
  getAllPosts,
  getPostsAndComments,
  getAllUsers,
  loginUser,*/
} = require("../controller/connect.js");

// GET Functions for Projects
//router.get("/", getAllData);

// DELETE Functions for Projects
//router.delete("/:id", deleteProject);

// UPDATE/PATCH Functions for Projects
//router.patch("/:id", updateProject);

// Register user

// Get all games
router.get("/", async (req, res) => {
  try {
    const games = await getAllGames();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games from DB", message: err.message });
  }
});


// RAWG API search
router.get("/external", async (req, res) => {
  const search = req.query.search || "";
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "RAWG API key not set in environment variables." });
  }

  try {
    const response = await axios.get("https://api.rawg.io/api/games", {
      params: {
        key: apiKey,
        search,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from RAWG API", message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const game = req.body;

    const {
      id: rawg_id,
      name,
      background_image: image_url,
      genres,
      platforms,
      stores,
      released: release_date,
      rating,
      ratings_count,
      esrb_rating,
      description, // RAWG might need a second API call for this
    } = game;

    const genreStr = genres?.map(g => g.name).join(", ") || "";
    const platformStr = platforms?.map(p => p.platform.name).join(", ") || "";
    const storeStr = stores?.map(s => s.store.name).join(", ") || "";
    const esrb = esrb_rating?.name || null;

    // Check if the game already exists
    const checkResult = await pool
      .request()
      .input("rawg_id", sql.Int, rawg_id)
      .query("SELECT * FROM games WHERE rawg_id = @rawg_id");

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ message: "Game already exists" });
    }

    await pool
      .request()
      .input("rawg_id", sql.Int, rawg_id)
      .input("name", sql.VarChar(255), name)
      .input("image_url", sql.Text, image_url)
      .input("genres", sql.VarChar(255), genreStr)
      .input("platforms", sql.VarChar(255), platformStr)
      .input("stores", sql.VarChar(255), storeStr)
      .input("studio", sql.VarChar(255), null) // RAWG doesn't provide studio in this call
      .input("release_date", sql.Date, release_date || null)
      .input("description", sql.Text, description || null)
      .input("rating", sql.Float, rating || null)
      .input("ratings_count", sql.Int, ratings_count || 0)
      .input("esrb_rating", sql.VarChar(50), esrb)
      .query(`
        INSERT INTO games
        (rawg_id, name, image_url, genres, platforms, stores, studio, release_date, description, rating, ratings_count, esrb_rating)
        VALUES
        (@rawg_id, @name, @image_url, @genres, @platforms, @stores, @studio, @release_date, @description, @rating, @ratings_count, @esrb_rating)
      `);

    res.status(201).json({ message: "Game saved successfully" });
  } catch (err) {
    console.error("Error saving game:", err);
    res.status(500).json({ message: "Failed to save game", error: err.message });
  }
});

// DELETE a game by ID
router.delete("/:id", async (req, res) => {
  const gameId = req.params.id;
  try {
    await pool
      .request()
      .input("id", sql.Int, gameId)
      .query("DELETE FROM games WHERE id = @id");

    res.status(200).json({ message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete game", message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM games WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch game", error: err.message });
  }
});

/*
// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get posts and comments
router.get("/posts-comments", async (req, res) => {
  try {
    const postsAndComments = await getPostsAndComments();
    res.status(200).json(postsAndComments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create post
router.post("/posts", async (req, res) => {
  try {
    const { user_id, title, content } = req.body;
    await createPost(user_id, title, content);
    res.status(201).send("Post created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add comment
router.post("/comments", async (req, res) => {
  try {
    const { post_id, user_id, content } = req.body;
    await addComment(post_id, user_id, content);
    res.status(201).send("Comment added successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add or remove a like to a post
// Add or remove a like to a post
router.post("/likes", async (req, res) => {
  try {
    const { post_id, user_id } = req.body;

    // Überprüfen, ob der Benutzer den Post bereits geliked hat
    const likeCheck = await pool
      .request()
      .input("post_id", sql.Int, post_id)
      .input("user_id", sql.Int, user_id)
      .query(
        "SELECT * FROM likes WHERE post_id = @post_id AND user_id = @user_id"
      );

    if (likeCheck.recordset.length > 0) {
      // Benutzer hat den Post bereits geliked, also Like entfernen
      await removeLike(post_id, user_id);
      return res.status(200).json({ message: "Like removed successfully" });
    } else {
      // Benutzer hat den Post noch nicht geliked, also Like hinzufügen
      await addLike(post_id, user_id);
      return res.status(201).json({ message: "Like added successfully" });
    }
  } catch (err) {
    console.error("Error adding or removing like:", err);
    res.status(500).json({ message: "Error adding or removing like" });
  }
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    await registerUser(username, email, password);
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (user) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
*/
module.exports = router; 