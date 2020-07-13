const express = require('express');

const ChoiceService = require('./services.js');
const {
    ServerError
} = require('../../errors');
const {
    extractPathParam
} = require('../../middleware/extract.js');

const router = express.Router();

// create
router.post('/', async (req, res, next) => {
    const {
        parentSceneId,
        title,
        content,
        template,
        note,
    } = req.body;

    try {
        await ChoiceService.create(parseInt(parentSceneId), title, content, template, note)

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

// get one by id
router.get('/:choiceId', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.state;
    
    try {
        const scene = await ChoiceService.getById(parseInt(choiceId))

        res.json(scene);
    } catch (err) {
        next(err);
    }
});

// get all choices of a scene
router.get('/all/:sceneId', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.state;
    
    try {
        const scenes = await ChoiceService.getAllBySceneId(parseInt(sceneId))

        res.json(scenes);
    } catch (err) {
        next(err);
    }
});

// set parent scene for a choice
router.put('/:choiceId/parent', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.state;
    const {
        parentSceneId
    } = req.body;

    try {
        await ChoiceService.setParentScene(parseInt(choiceId), parseInt(parentSceneId))

        res.status(200);
    } catch (err) {
        next(err);
    }
});

// set next scene for a choice
router.put('/:choiceId/next', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.state;
    const {
        nextSceneId
    } = req.body;

    try {
        await ChoiceService.setNextScene(parseInt(choiceId), parseInt(nextSceneId))

        res.status(200);
    } catch (err) {
        next(err);
    }
});

// update details
router.put('/:choiceId/details', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        sceneId
    } = req.state;
    const {
        title,
        content,
    } = req.body;

    try {
        await ChoiceService.setDetails(parseInt(sceneId), title, content)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;