import express from "express";
import axios from "axios";

import {
  findAllUsers,
  addUser,
  findUser,
  deleteUser,
  deleteAll,
  updateUser,
  addMovie,
  MovieReview,
  userReviews,
  jaAvaliou,
  updateReview,
} from "./index";
import { error } from "console";

const app = express();
const PORT = 3100;

app.use(express.json());

//get one user
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await findUser(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
});

//get all users
app.get("/users", async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
});

//post user
app.post("/users", async (req, res) => {
  const newUser = req.body;
  res.status(200).json(newUser);
  try {
    const createdUser = await addUser(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
});

//update user
app.put("/users/update/:id", async (req, res) => {
  const userUpdate = req.body;
  const { id } = req.params;
  try {
    const user = await updateUser(userUpdate, id);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

//delete one user
app.delete("/users/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

//delete all users
app.delete("/users/delete", async (req, res) => {
  try {
    const users = await deleteAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error deleting users" });
  }
});

//post one movie in a user
app.post("/users/:id/review", async (req, res) => {
  const { id } = req.params;
  const newReview: MovieReview = req.body;
  try {
    if(newReview.note < 0 || newReview.note > 10){
      throw error;
    }
    if(await jaAvaliou(id,newReview.title)){
      const novaReview = await updateReview(id,newReview);
      res.status(200).json(novaReview);
    }else{
      const resposta = await axios.get(`https://www.omdbapi.com/?t=${newReview.title}&apikey=93e4af74`);
      if(resposta.data.Title == undefined){
        throw error;
      }
      const review = await addMovie(id, newReview);
      res.status(200).json(review);
    }
  } catch (error) {
    res.status(500).json({ error: "Error reviewing movie" });
  }
});

//get reviews by a user
app.get("/users/:id/reviews", async(req,res)=>{
  const {id} = req.params;
  const user = await userReviews(id);
  try{
    if(user){
      res.status(200).json(user.reviewedMovies);
    }
  }
  catch(error){
    res.status(500).json({ error: "Error getting reviews" });
  }
});

//delete one review
app.delete("/users/:id/reviews/delete", async (req,res)=>{
  
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
