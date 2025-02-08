import express from "express";
import Story from "../models/Story.js";

const router = express.Router();

// GET all stories
router.get("/", async (req, res) => {
    try {
        const stories = await Story.find().sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stories" });
    }
});

// GET a single story by ID
router.get("/:id", async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ error: "Story not found" });
        res.json(story);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch story" });
    }
});

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
