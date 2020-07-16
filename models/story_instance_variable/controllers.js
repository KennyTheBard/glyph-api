const express = require('express');
const humps = require('humps');

const InstanceVariableService = require('./services.js');
const VariableService = require('../story_variable/services.js');
const InstanceService = require('../story_instance/services.js');
const {
    extractPathParam
} = require('../../middleware/extract.js');
const {
    ServerError
} = require('../../errors');

const router = express.Router();

router.get('/:instanceId/:variableId', extractPathParam('instanceId'),
        extractPathParam('variableId'), async (req, res, next) => {
    const {
        instanceId,
        variableId,
    } = req.params;
    
    try {
        const variables = await InstanceVariableService.getByInstanceIdAndVariableId(instanceId, variableId)

        res.json(humps.camelizeKeys(variables));
    } catch (err) {
        next(err);
    }
});

router.get('/:instanceId/all', extractPathParam('instanceId'), async (req, res, next) => {
    const {
        instanceId,
    } = req.params;

    try {
        const variables = await InstanceVariableService.getByInstanceId(instanceId)

        res.json(humps.camelizeKeys(variables[0]));
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    const {
        instanceId,
        variableId,
        value,
    } = req.body;

    try {
        await InstanceService.getById(instanceId);
        await VariableService.getById(variableId);
        await InstanceVariableService.setValue(instanceId, variableId, value);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;