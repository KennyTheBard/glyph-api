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
        await ChoiceService.create(parentSceneId, title, content, template, note)

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

// get one by id
router.get('/:choiceId', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.params;
    
    try {
        const scene = await ChoiceService.getById(choiceId)

        res.json(scene);
    } catch (err) {
        next(err);
    }
});

// get all choices of a scene
router.get('/all/:sceneId', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.params;
    
    try {
        const scenes = await ChoiceService.getAllBySceneId(sceneId)

        res.json(scenes);
    } catch (err) {
        next(err);
    }
});

// set parent scene for a choice
router.put('/:choiceId/parent', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.params;
    const {
        parentSceneId
    } = req.body;

    try {
        await ChoiceService.setParentScene(choiceId, parentSceneId)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

// set next scene for a choice
router.put('/:choiceId/next', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.params;
    const {
        nextSceneId
    } = req.body;

    try {
        await ChoiceService.setNextScene(choiceId, nextSceneId)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

// update details
router.put('/:choiceId/details', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        sceneId
    } = req.params;
    const {
        title,
        content,
    } = req.body;

    try {
        await ChoiceService.setDetails(sceneId, title, content)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;