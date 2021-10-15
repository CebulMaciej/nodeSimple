const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser')
const expressJSDocSwagger = require('express-jsdoc-swagger');

/**
 * A client
 * @typedef {object} LoginRequest
 * @property {string} login.required -  login
 * @property {string} password.required - password
 */
const options = {
    info: {
        version: '1.0.0',
        title: 'OrientDB Connector',
    },
    baseDir: __dirname,
    // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
    filesPattern: './**/*.js',
    // URL where SwaggerUI will be rendered
    swaggerUIPath: '/api-docs',
    // Expose OpenAPI UI
    exposeSwaggerUI: true,
    // Expose Open API JSON Docs documentation in `apiDocsPath` path.
    exposeApiDocs: false,
    // Open API JSON Docs endpoint.
    apiDocsPath: '/v3/api-docs',
    // Set non-required fields as nullable by default
    notRequiredAsNullable: false,
    // You can customize your UI options.
    // you can extend swagger-ui-express config. You can checkout an example of this
    // in the `example/configuration/swaggerOptions.js`
    swaggerUiOptions: {},
};

const app = express();
const PORT = 8091;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: '*'
}));
function generateAccessToken(username) {
    return jwt.sign({username: username}, "superExpressKey", { expiresIn: '1800s' });
}



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, "superExpressKey", (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

/**
 * GET /api/healthCheck
 * @summary This is the summary of the endpoint
 * @tags User
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get('/api/me',authenticateToken, async (req, res) => {

    try
    {
        res.json({username: "admin"})
    }
    catch(ex){
        res.statusCode = 500;
        res.json(ex)
    }
});


/**
 * GET /api/me
 * @summary This is the summary of the endpoint
 * @tags User
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.get('/api/me', async (req, res) => {

    try
    {


        res.json({username: "admin"})
    }
    catch(ex){
        res.statusCode = 500;
        res.json(ex)
    }
});

/**
 * POST /api/login
 * @summary This is the summary of the endpoint
 * @tags User
 * @param {LoginRequest} request.body - login request
 * @return {object} 200 - success response - application/json
 * @return {object} 400 - Bad request response
 */
app.post('/api/login', async (req, res) => {

    try
    {
        let login = req.body.login;
        let password = req.body.password;

        if(login !== "admin" || password !== "admin"){
            res.statusCode=400;
            res.json(null);
            return;
        }

        let result = generateAccessToken(login);

        res.json(result);
    }
    catch(ex){
        res.statusCode = 500;
        res.json(ex)
    }
});
expressJSDocSwagger(app)(options);

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));