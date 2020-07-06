const express = require('express');

const ChoiceService = require('./services.js');
const {
    ServerError
} = require('../../errors');
const {
    extractPathParam
} = require('../../middleware/extract.js');

const router = express.Router();

router.post('/', async (req, res, next) => {
    const {
        title,
        content,
        template,
        note,
    } = req.body;

    try {
        ChoiceService.create(title, content,template, note)

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/:choiceId', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.params;
    
    try {
        const scene = ChoiceService.getById(choiceId)

        res.json(scene);
    } catch (err) {
        next(err);
    }
});

router.get('/all/:sceneId', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.params;
    
    try {
        const scenes = ChoiceService.getAllBySceneId(sceneId)

        res.json(scenes);
    } catch (err) {
        next(err);
    }
});

router.put('/:choiceId/parent', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.params;
    const {
        parentSceneId
    } = req.body;

    try {
        ChoiceService.setParentScene(choiceId, parentSceneId)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.put('/:choiceId/next', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        choiceId
    } = req.params;
    const {
        nextSceneId
    } = req.body;

    try {
        ChoiceService.setNextScene(choiceId, nextSceneId)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.put('/:choiceId/details', extractPathParam('choiceId'), async (req, res, next) => {
    const {
        sceneId
    } = req.params;
    const {
        title,
        content,
    } = req.body;

    try {
        ChoiceService.setDetails(sceneId, title, content)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;