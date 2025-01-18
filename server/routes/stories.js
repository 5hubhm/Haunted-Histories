import { Router } from 'express';
const router = Router();
import Story from '../models/Story.js';

// Get all stories
router.get('/', async (req, res) => {
    try {
        const stories = await find();
        res.json(stories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new story
router.post('/', async (req, res) => {
    const story = new Story({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
    });

    try {
        const newStory = await story.save();
        res.status(201).json(newStory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
