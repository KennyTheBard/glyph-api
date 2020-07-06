const express = require('express');

const SceneService = require('./services.js');
const {
    ServerError
} = require('../../errors');
const {
    extractPathParam
} = require('../../middleware/extract.js');

const router = express.Router();

// const templateRegex = '/\${([A-Z]|[a-z]|[0-9]|_|-)+}/g';

router.post('/', async (req, res, next) => {
    const {
        storyId,
        title,
        content,
        template,
        note,
    } = req.body;

    try {
        SceneService.create(storyId, title, content, template, note)

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/:sceneId', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.params;
    
    try {
        const scene = SceneService.getById(sceneId)

        res.json(scene);
    } catch (err) {
        next(err);
    }
});

router.put('/:sceneId/details', extractPathParam('sceneId'), async (req, res, next) => {
    const {
        sceneId
    } = req.params;
    const {
        title,
        content,
        template,
        note,
    } = req.body;

    try {
        SceneService.setDetails(sceneId, title, content, template, note)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;