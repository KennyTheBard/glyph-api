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

const getAll = async () => {
    const rows = await query('SELECT * FROM story', []);
    return rows;
}

const getById = async (storyId) => {
    const rows = await query('SELECT * FROM story WHERE id = $1', [storyId]);
    if (rows.length === 0) {
        throw new ServerError('Unknown resource', 400);
    }

    return rows[0];
}

const setStartingScene = async (storyId, startingSceneId) => {
    const rows = await query('UPDATE story SET starting_scene_id = $2 WHERE id = $1', [storyId, startingSceneId]);
    return rows;
}

const setDetails = async (storyId, title, description) => {
    const rows = await query('UPDATE story SET title = $2, description = $3 WHERE id = $1', [storyId, title, description]);
    return rows;
}

module.exports = {
    create,
    getAll,
    getById,
    setStartingScene,
    setDetails
}