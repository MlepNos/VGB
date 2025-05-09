// express
const express = require("express");

// sql
const sql = require("mssql");
const bcrypt = require("bcrypt");

// env
require("dotenv").config();

console.log(process.env.USER);
// configure db connection
const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.SERVER,
  database: process.env.DATABASE,
  options: {
    encrypt: true, // Use if connecting to Azure SQL Database
    trustServerCertificate: true,
  },
};

// Create a pool of database connections
const pool = new sql.ConnectionPool(config);

const getAllGames = async () => {
  try {
    const result = await pool.request().query("SELECT * FROM games");
    return result.recordset;
  } catch (err) {
    console.error("Error getting posts:", err);
    throw err;
  }
};

const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log("Connected to Database.");
  } catch (err) {
    console.error("Error connecting to Database:", err);
    throw err; // Re-throw the error to be handled by the caller
  }
};
/*
const registerUser = async (username, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .execute("register_user");
    return result;
  } catch (err) {
    console.error("Error registering user:", err);
    throw err;
  }
};

const loginUser = async (email, password) => {
  try {
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    const user = result.recordset[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error logging in user:", err);
    throw err;
  }
};

const createPost = async (user_id, title, content) => {
  try {
    const result = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .input("title", sql.VarChar, title)
      .input("content", sql.Text, content)
      .query(
        `INSERT INTO posts (user_id, title, content) VALUES (@user_id, @title, @content)`
      );
    return result;
  } catch (err) {
    console.error("Error creating post:", err);
    throw err;
  }
};
const addComment = async (post_id, user_id, content) => {
  try {
    const result = await pool
      .request()
      .input("post_id", sql.Int, post_id)
      .input("user_id", sql.Int, user_id)
      .input("content", sql.Text, content)
      .execute("add_comment");
    return result;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
};

const addLike = async (post_id, user_id) => {
  try {
    const result = await pool
      .request()
      .input("post_id", sql.Int, post_id)
      .input("user_id", sql.Int, user_id)
      .execute("add_like");
    return result;
  } catch (err) {
    console.error("Error adding like:", err);
    throw err;
  }
};

const removeLike = async (post_id, user_id) => {
  try {
    const result = await pool
      .request()
      .input("post_id", sql.Int, post_id)
      .input("user_id", sql.Int, user_id)
      .query(
        "DELETE FROM likes WHERE post_id = @post_id AND user_id = @user_id"
      );
    return result;
  } catch (err) {
    console.error("Error removing like:", err);
    throw err;
  }
};

const getAllUsers = async () => {
  try {
    const result = await pool.request().query("SELECT * FROM users");
    return result.recordset;
  } catch (err) {
    console.error("Error getting users:", err);
    throw err;
  }
};

const getPostsAndComments = async () => {
  try {
    const result = await pool.request().query(`
        SELECT
          p.id AS post_id,
          p.title,
          p.content AS post_content,
          p.created_at AS post_created_at,
          u.username AS post_user,
          c.id AS comment_id,
          c.content AS comment_content,
          c.created_at AS comment_created_at,
          cu.username AS comment_user,
          (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN users cu ON c.user_id = cu.id
        ORDER BY p.created_at, c.created_at
      `);
    const posts = {};
    result.recordset.forEach((row) => {
      if (!posts[row.post_id]) {
        posts[row.post_id] = {
          post_id: row.post_id,
          title: row.title,
          post_content: row.post_content,
          post_created_at: row.post_created_at,
          post_user: row.post_user,
          like_count: row.like_count,
          comments: [],
        };
      }
      if (row.comment_id) {
        posts[row.post_id].comments.push({
          comment_id: row.comment_id,
          comment_content: row.comment_content,
          comment_created_at: row.comment_created_at,
          comment_user: row.comment_user,
        });
      }
    });
    return Object.values(posts);
  } catch (err) {
    console.error("Error getting posts and comments:", err);
    throw err;
  }
};
*/
module.exports = {
  pool,
  sql,
  connectToDatabase,
  getAllGames,
  /*
  createPost,
  addComment,
  addLike,
  getAllPosts,
  getAllUsers,
  getPostsAndComments,
  registerUser,
  loginUser,
  removeLike,*/
};