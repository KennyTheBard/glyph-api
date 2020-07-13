const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (storyId, content, template, note) => {
    const rows = await query('INSERT INTO scene (story_id, content, template, note)' +
            'VALUES ($1, $2, $3, $4) RETURNING *', [storyId, content, template, note]);
    return rows;
}

const getById = async (sceneId) => {
    const rows = await query('SELECT * FROM scene WHERE id = $1', [sceneId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getByStoryId = async (storyId) => {
    const rows = await query('SELECT * FROM scene WHERE story_id = $1', [storyId]);
    return rows;
}

const getByIdAndStoryId = async (sceneId, storyId) => {
    const rows = await query('SELECT * FROM scene WHERE id = $1 and story_id = $2', [sceneId, storyId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const setDetails = async (sceneId, content, template, note) => {
    const rows = await query('UPDATE scene SET content = $2, template = $3, note = $4 ' +
            'WHERE id = $1', [sceneId, content, template, note]);
    return rows;
}

module.exports = {
    create,
    getById,
    getByStoryId,
    getByIdAndStoryId,
    setDetails
}