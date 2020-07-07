const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (userId, currentSceneId) => {
    const rows = await query('INSERT INTO story_instance (user_id, current_scene_id)' +
            'VALUES ($1, $2) RETURNING *', [userId, currentSceneId]);
    return rows;
}

const getById = async (storyInstanceId) => {
    const rows = await query('SELECT story_instance WHERE id = $1', [storyInstanceId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getByStoryId = async (storyId) => {
    const rows = await query('SELECT story_instance WHERE story_id = $1', [storyId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const setCurrentScene = async (storyInstanceId, currentSceneId) => {
    const rows = await query('UPDATE story_instance SET current_scene_id = $2 WHERE id = $1',
            [storyInstanceId, currentSceneId]);
    return rows;
}

module.exports = {
    create,
    getById,
    getByStoryId,
    setCurrentScene,
}