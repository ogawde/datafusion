import express from "express";



const app = express();



app.get("/", (req, res) => {
    res.json({ message: "Express + TypeScript" });
});

app.listen(3000, () => {
    console.log(`Server running`);
});
