const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (storyId, name, type, defaultValue, note) => {
    const rows = await query('INSERT INTO story_variable (story_id, name, type, default_value, note)' +
            'VALUES ($1, $2, $3, $4, $5) RETURNING *', [storyId, name, type, defaultValue, note]);
    return rows;
}

const getById = async (varId) => {
    const rows = await query('SELECT story_variable WHERE id = $1', [varId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getByStoryId = async (storyId) => {
    const rows = await query('SELECT * FROM story_variable WHERE story_id = $1', [storyId]);
    return rows;
}

const setDefaulValue = async (varId, defaultValue) => {
    const rows = await query('UPDATE story_instance SET default_value = $2 WHERE id = $1',
            [varId, defaultValue]);
    return rows;
}

module.exports = {
    create,
    getById,
    getByStoryId,
    setDefaulValue,
}