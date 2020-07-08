const express = require('express');

const VariableService = require('./services.js');
const StoryService = require('../story/services.js');
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
        name,
        type,
        defaultValue,
        note,
    } = req.body;

    try {
        await StoryService.getById(storyId);
        VariableService.create(storyId, name, type, defaultValue, note);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/:varId', extractPathParam('varId'), async (req, res, next) => {
    const {
        varId
    } = req.params;
    
    try {
        const variable = VariableService.getById(varId)

        res.json(variable);
    } catch (err) {
        next(err);
    }
});

router.get('/:storyId/all', extractPathParam('storyId'), async (req, res, next) => {
    const {
        storyId
    } = req.params;
    
    try {
        const variables = VariableService.getByStoryId(storyId)

        res.json(variables);
    } catch (err) {
        next(err);
    }
});

router.put('/:varId/default-value', extractPathParam('varId'), async (req, res, next) => {
    const {
        varId
    } = req.params;
    const {
        defaultValue,
    } = req.body;

    try {
        await VariableService.setDefaulValue(varId, defaultValue)

        res.status(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;