const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (userId, storyId, currentSceneId) => {
    const rows = await query('INSERT INTO story_instance (user_id, story_id, current_scene_id)' +
            'VALUES ($1, $2, $3) RETURNING *', [userId, storyId, currentSceneId]);
    return rows;
}

const getById = async (storyInstanceId) => {
    const rows = await query('SELECT * FROM story_instance WHERE id = $1', [storyInstanceId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const getByUserId = async (userId) => {
    const rows = await query('SELECT * FROM story_instance WHERE user_id = $1', [userId]);
    return rows;
}

const getByUserIdAndStoryId = async (userId, storyId) => {
    const rows = await query('SELECT * FROM story_instance WHERE ' +
        'user_id = $1 AND story_id = $2', [userId, storyId]);
    return rows;
}

const setCurrentScene = async (storyInstanceId, currentSceneId) => {
    const rows = await query('UPDATE story_instance SET current_scene_id = $2 WHERE id = $1 RETURNING *',
            [storyInstanceId, currentSceneId]);
    return rows;
}

module.exports = {
    create,
    getById,
    getByUserId,
    getByUserIdAndStoryId,
    setCurrentScene,
}