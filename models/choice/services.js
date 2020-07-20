const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (parentSceneId, content, template, note) => {
    const rows = await query('INSERT INTO choice (parent_scene_id, content, template, note)' +
            'VALUES ($1, $2, $3, $4) RETURNING *', [parentSceneId, content, template, note]);
    return rows;
}

const getById = async (choiceId) => {
    const rows = await query('SELECT * FROM choice WHERE id = $1', [choiceId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getAllByParentSceneId = async (sceneId) => {
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

const setDetails = async (sceneId, content, note) => {
    const rows = await query('UPDATE choice SET content = $2, note = $3 WHERE id = $1', [sceneId, content, note]);
    return rows;
}

module.exports = {
    create,
    getById,
    getAllByParentSceneId,
    setParentScene,
    setNextScene,
    setDetails
}