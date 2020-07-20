const express = require('express');
const humps = require('humps');

const StoryInstanceService = require('./services.js');
const StoryService = require('../story/services.js');
const SceneService = require('../scene/services.js');
const ChoiceService = require('../choice/services.js');

const {
    extractPathParam
} = require('../../middleware/extract.js');
const {
    ServerError
} = require('../../errors');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const {
        storyId,
        decoded,
    } = req.state;

    try {
        const story = humps.camelizeKeys(await StoryService.getById(storyId));
        const instances = await StoryInstanceService.create(decoded.userId, story.startingSceneId);

        res.status(201).json(humps.camelizeKeys(instances[0]));
    } catch (err) {
        next(err);
    }
});

router.post('/:storyInstanceId/choose', extractPathParam('storyInstanceId'), async (req, res, next) => {
    const {
        storyId,
        storyInstanceId,
        decoded,
    } = req.state;
    const {
        choiceId,
    } = req.body;

    try {
        const instance = humps.camelizeKeys(await StoryInstanceService.getById(parseInt(storyInstanceId)));
        let choices = humps.camelizeKeys(await ChoiceService.getAllByParentSceneId(instance.currentSceneId))
            .filter((c) => c.storyId === parseInt(storyId))
            .filter((c) => c.id === parseInt(choiceId));
        
        if (choices.length === 0) {
            throw new ServerError("No choice found by that ID to that scene", 400)
        }
        
        // set current scene
        let rows = await StoryInstanceService.setCurrentScene(parseInt(storyInstanceId), choices[0].nextSceneId);
        if (rows.length === 0) {
            throw new ServerError("Story instance has not been altered", 500)
        }

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    const {
        storyId,
        decoded
    } = req.state;
    const {
        userId
    } = decoded;

    try {
        const instances = await StoryInstanceService.getByUserIdAndStoryId(parseInt(userId), parseInt(storyId));
        if (instances.length === 0) {
            throw new ServerError("No story instance of this story found", 400)
        }

        if (instances.length > 1) {
            throw new ServerError("To many unfinished story instances", 500)
        }

        res.json(humps.camelizeKeys(instances[0]));
    } catch (err) {
        next(err);
    }
});

router.get('/:storyInstanceId/current', extractPathParam('storyInstanceId'), async (req, res, next) => {
    const {
        storyInstanceId,
        storyId,
        decoded
    } = req.state;

    try {
        const instance = humps.camelizeKeys(await StoryInstanceService.getById(parseInt(storyInstanceId)));

        if (instance.storyId !== parseInt(storyId)) {
            throw new ServerError('Unknown resource', 404); 
        }

        if (instance.userId !== parseInt(decoded.id)) {
            throw new ServerError('Access denied', 405); 
        }

        let scene = await SceneService.getByIdAndStoryId(instance.currentSceneId, instance.storyId);
        let choices = await ChoiceService.getAllByParentSceneId(instance.currentSceneId);

        res.json(humps.camelizeKeys({
            scene: scene,
            choices: choices,
        }));
    } catch (err) {
        next(err);
    }
});

router.put('/:storyInstanceId/current', extractPathParam('storyInstanceId'), async (req, res, next) => {
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