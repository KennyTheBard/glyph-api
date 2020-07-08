const express = require('express');

const StoryService = require('./services.js');
const SceneService = require('../scene/services.js');
const {
    extractPathParam
} = require('../../middleware/extract.js');
const {
    ServerError
} = require('../../errors');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const {
        title,
        description,
    } = req.body;

    try {
        await StoryService.create(req.state.decoded.userId, title, description);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/:storyId', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId
    } = req.params;
    
    try {
        const story = await StoryService.getById(storyId);

        res.json(story);
    } catch (err) {
        next(err);
    }
});

router.put('/:storyId/starting-scene', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId
    } = req.params;
    const {
        startingSceneId,
    } = req.body;

    try {
        await SceneService.getById(startingSceneId);
        await StoryService.setStartingScene(storyId, startingSceneId);

        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.put('/:storyId/details', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId
    } = req.params;
    const {
        title,
        description,
    } = req.body;

    try {
        await StoryService.setDetails(storyId, title, description);

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;