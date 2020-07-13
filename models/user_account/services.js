const {
    query
} = require('../../data');
const {
    generateToken,
} = require('../../security/jwt');
const {
    hash,
    compare
} = require('../../security/password');
const {
    ServerError
} = require('../../errors');


const register = async (username, email, password, birth_date, activationCode) => {
    // check uniqueness by username
    const usersByUsername = await query(`SELECT u.id, u.hash_password FROM user_account u
                                WHERE u.username = $1`, [username]);
    if (usersByUsername.length !== 0) {
        throw new ServerError('Exista deja un utilizator cu acest username inregistrat in sistem!', 400);
    }

    // check uniqueness by email
    const usersByEmail = await query(`SELECT u.id, u.hash_password FROM user_account u
                                WHERE u.email = $1`, [email]);
    if (usersByEmail.length !== 0) {
        throw new ServerError('Exista deja un utilizator cu acest email inregistrat in sistem!', 400);
    }

    let hash_password = await hash(password);
    let ret = await query('INSERT INTO user_account (username, email, hash_password, birth_date, registration_date, activated, activation_code) ' +
        'VALUES ($1, $2, $3, $4, now(), FALSE, $5) RETURNING *', [username, email, hash_password, birth_date, activationCode]);

    return ret[0].id;
};

const authenticateByUsername = async (username, password) => {
    const users = await query(`SELECT * FROM user_account u
                                WHERE u.username = $1`, [username]);

    if (users.length === 0) {
        throw new ServerError('Authentication credentials are incorrect!', 400);
    }
    const user = users[0];

    // check registration dates
    const check = await compare(password, user.hash_password);
    if (!check) {
        throw new ServerError('Authentication credentials are incorrect!', 400);
    }

    // check if the account has been activated
    if (!user.activated) {
        throw new ServerError("Contul trebuie activat folosind linkul primit pe email inainte de a il folosi!", 400);
    }

    // generate token payload
    let token = await generateToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
    })

    return token
};

const authenticateByEmail = async (email, password) => {
    const users = await query(`SELECT * FROM user_account u
                                WHERE u.email = $1`, [email]);

    if (users.length === 0) {
        throw new ServerError('Authentication credentioals are incorrect!', 400);
    }
    const user = users[0];

    // check registration dates
    const check = await compare(password, user.hash_password);
    if (!check) {
        throw new ServerError('Authentication credentioals are incorrect!', 400);
    }

    // check if the account has been activated
    if (!user.activated) {
        throw new ServerError("Contul trebuie activat folosind linkul primit pe email inainte de a il folosi!", 400);
    }

    // generate token payload
    let token = await generateToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
    })

    return token
};

const activate = async (id, activationCode) => {
    const rows = await query(`UPDATE user_account SET activated = TRUE WHERE id = $1 AND activation_code = $2 RETURNING *`, [id, activationCode]);
    return rows
};

const getById = async (id) => {
    const users = await query(`SELECT * FROM user_account WHERE id = $1`, [id]);
    return users
};

module.exports = {
    register,
    authenticateByUsername,
    authenticateByEmail,
    activate, 
    getById
}