const express = require('express');
const humps = require('humps');

const StoryInstanceService = require('./services.js');
const StoryService = require('../story/services.js');
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
        storyId
    } = req.body;

    try {
        const story = await StoryService.getById(storyId);
        StoryInstanceService.create(req.state.decoded.userId, story.starting_scene_id);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId,
        decoded
    } = req.state;
    const {
        userId
    } = decoded;


    try {
        const instances = StoryInstanceService.getByUserIdAndStoryId(userId, storyId)

        res.json(humps.camelizeKeys(instances));
    } catch (err) {
        next(err);
    }
});

router.put('/:storyInstanceId/current-scene', extractPathParam('storyInstanceId'), async (req, res, next) => {
    const {
        storyInstanceId
    } = req.state;
    const {
        currentSceneId,
    } = req.body;

    try {
        await SceneService.getByIdAndStoryId(storyInstanceId, currentSceneId)
        await StoryInstanceService.setCurrentScene(storyInstanceId, currentSceneId)

        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;