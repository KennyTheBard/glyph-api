const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (parentSceneId, title, content, template, note) => {
    const rows = await query('INSERT INTO choice (parent_scene_id, title, content, template, note)' +
            'VALUES ($1, $2, $3, $4, $5) RETURNING *', [parentSceneId, title, content, template, note]);
    return rows;
}

const getById = async (choiceId) => {
    const rows = await query('SELECT * FROM choice WHERE id = $1', [choiceId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getAllBySceneId = async (sceneId) => {
    const rows = await query('SELECT * FROM choice WHERE parent_scene_id = $1', [sceneId]);
    return rows;
}

const setParentScene = async (choiceId, parentSceneId) => {
    const rows = await query('UPDATE choice SET parent_scene_id = $2 WHERE id = $1', [choiceId, parentSceneId]);
    return rows;
}

const setNextScene = async (choiceId, nextSceneId) => {
    const rows = await query('UPDATE choice SET next_scene_id = $2 WHERE id = $1', [choiceId, nextSceneId]);
    return rows;
}

const setDetails = async (sceneId, title, content, note) => {
    const rows = await query('UPDATE choice SET title = $2, content = $3, note = $4 WHERE id = $1', [sceneId, title, content]);
    return rows;
}

module.exports = {
    create,
    getById,
    getAllBySceneId,
    setParentScene,
    setNextScene,
    setDetails
}