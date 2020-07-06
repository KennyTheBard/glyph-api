const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (storyId, title, content, template, note) => {
    const rows = await query('INSERT INTO scene (story_id, title, content, template, note)' +
            'VALUES ($1, $2, $3, $4, $5) RETURNING *', [storyId, title, content, template, note]);
    return rows;
}

const getById = async (sceneId) => {
    const rows = await query('SELECT scene WHERE id = $1', [sceneId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const setDetails = async (sceneId, title, content, template, note) => {
    const rows = await query('UPDATE scene SET title = $2, content = $3, template = $4, note = $5 ' +
            'WHERE id = $1', [sceneId, title, content, template, note]);
    return rows;
}

module.exports = {
    create,
    getById,
    setDetails
}