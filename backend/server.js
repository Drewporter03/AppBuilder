import express from "express";

const app = express();

app.get("/api/portal", (req,res)=> {res.send("You have built 20 projects")})

app.post("/api/notes", (req,res)=> {res.status(201).json({message:"Post Created Successfully!"})});

app.put("/api/notes/:id", (req,res)=> {res.status(200).json({message:"Post Updated Successfully!"})})

app.delete("/api/notes/:id", (req,res)=> {res.status(200).json({message:"Post Deleted Successfully!"})})


app.listen(5001, () => {console.log("Server started on port: 5001")});