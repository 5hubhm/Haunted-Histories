import express from "express";
import Story from "../models/Story.js";

const router = express.Router();

// POST a new story
router.post("/submit-story", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized. Please log in first." });
    }

    const { title, city, location, description } = req.body;
    const newStory = new Story({ title, city, location, description, submittedBy: req.session.user.id });
    await newStory.save();

    res.status(201).json(newStory);
});




export default router;
