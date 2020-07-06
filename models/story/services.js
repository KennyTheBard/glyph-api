const {
    query
} = require('../../data');
const {
    ServerError
} = require('../../errors')

const create = async (authorId, title, description) => {
    const rows = await query('INSERT INTO story (author_id, title, description, published)' +
            'VALUES ($1, $2, $3, FALSE) RETURNING *', [authorId, title, description]);
    return rows;
}

const getById = async (storyId) => {
    const rows = await query('SELECT story WHERE id = $1', [storyId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown story', 400);
    }

    return rows[0];
}

const setStartingScene = async (storyId, startingSceneId) => {
    const scenes = await query('SELECT * FROM scene WHERE story_id = $1 AND id = $2', [storyId, startingSceneId]);
    if (scenes.length === 0) {
        throw new ServerError('Unknown scene', 400);
    }

    let scene = scenes[0];
    const rows = await query('UPDATE story SET starting_scene_id = $1 WHERE id = $2', [scene.id, scene.story_id]);
    return rows;
}

const setDetails = async (storyId, title, description) => {
    const rows = await query('UPDATE story SET title = $2, description = $3 WHERE id = $1', [storyId, title, description]);
    return rows;
}

module.exports = {
    create,
    getById,
    setStartingScene,
    setDetails
}