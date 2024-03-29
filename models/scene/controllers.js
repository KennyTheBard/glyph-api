const express = require('express');
const humps = require('humps');

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

        res.json(humps.camelizeKeys(scenes));
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

        res.json(humps.camelizeKeys(scene));
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

        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;