const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (instanceId, variableId, value) => {
    const rows = await query('INSERT INTO story_instance_variable (story_instance_id, story_variable_id, value)' +
            'VALUES ($1, $2, $3) RETURNING *', [instanceId, variableId, value]);
    return rows;
}

const getById = async (instanceVariableId) => {
    const rows = await query('SELECT * FROM story_instance_variable WHERE id = $1', [instanceVariableId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getByInstanceId = async (instanceId) => {
    const rows = await query('SELECT * FROM story_instance_variable WHERE story_instance_id = $1', [instanceId]);
    return rows;
}

const getByInstanceIdAndVariableId = async (instanceId, variableId) => {
    const rows = await query('SELECT * FROM story_instance_variable WHERE story_instance_id = $1 AND story_variable_id = $2',
            [instanceId, variableId]);
    return rows;
}

const setValue = async (instanceId, variableId, value) => {
    const rows = await query('UPDATE story_instance_variable SET value = $3 ' +
            'WHERE story_instance_id = $1 AND story_variable_id = $2', [instanceId, variableId, value]);
    return rows;
}

module.exports = {
    create,
    getById,
    getByInstanceId,
    getByInstanceIdAndVariableId,
    setValue,
}