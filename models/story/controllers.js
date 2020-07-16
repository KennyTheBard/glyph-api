const express = require('express');
const humps = require('humps');

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
        const rows = await StoryService.create(req.state.decoded.userId, title, description);

        res.status(201).json(humps.camelizeKeys(rows[0]));
    } catch (err) {
        next(err);
    }
});

router.get('/', extractPathParam('storyId'), async (req, res, next) => {
    try {
        const stories = await StoryService.getAll();

        res.json(humps.camelizeKeys(stories));
    } catch (err) {
        next(err);
    }
});

router.get('/:storyId', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId
    } = req.params;
    
    try {
        const story = await StoryService.getById(parseInt(storyId));

        res.json(humps.camelizeKeys(story));
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
        await SceneService.getById(parseInt(startingSceneId));
        await StoryService.setStartingScene(parseInt(storyId), parseInt(startingSceneId));

        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

router.put('/:storyId/details', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId
    } = req.state;
    const {
        title,
        description,
    } = req.body;

    try {
        await StoryService.setDetails(parseInt(storyId), title, description);

        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;