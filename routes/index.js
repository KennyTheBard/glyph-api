const Router = require('express')();

const Security = require('../security/Jwt/index.js');

const { extractPathParam } = require('../middleware/extract.js');

const UserRoute = require('../models/user_account/controllers.js');
const StoryRoute = require('../models/story/controllers.js');
const SceneRoute = require('../models/scene/controllers.js');
const ChoiceRoute = require('../models/choice/controllers.js');


Router.use('/user',
            UserRoute);

Router.use('/story',
            Security.authorizeAndExtractToken,
            StoryRoute);

Router.use('/story/:storyId/scene',
            Security.authorizeAndExtractToken,
            extractPathParam('storyId'),
            SceneRoute);

Router.use('/story/:storyId/choice',
            Security.authorizeAndExtractToken,
            extractPathParam('storyId'),
            ChoiceRoute);

module.exports = Router;