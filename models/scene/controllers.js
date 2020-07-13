const express = require('express');

const SceneService = require('./services.js');
const StoryService = require('../story/services.js');
const {
    ServerError
} = require('../../errors');
const {
    extractPathParam
} = require('../../middleware/extract.js');

const router = express.Router();

// const templateVariableRegex = '/\${([A-Z]|[a-z]|[0-9]|_|-)+}/g';

router.post('/', async (req, res, next) => {
    const {
        storyId,
    } = req.state;
    const {
        content,
        template,
        note,
    } = req.body;

    console.log(storyId, parseInt(storyId))

    try {
        await StoryService.getById(parseInt(storyId));
        await SceneService.create(parseInt(storyId), content, template, note);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('', async (req, res, next) => {
    const {
        storyId
    } = req.state;
    
    try {
        const scenes = await SceneService.getByStoryId(parseInt(storyId));

        res.json(scenes);
    } catch (err) {
        next(err);
    }
});

router.get('/:sceneId', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.state;
    
    try {
        const scene = await SceneService.getById(parseInt(sceneId));

        res.json(scene);
    } catch (err) {
        next(err);
    }
});

router.put('/:sceneId/details', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.state;
    const {
        content,
        template,
        note,
    } = req.body;

    try {
        await SceneService.setDetails(parseInt(sceneId), content, template, note);

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;