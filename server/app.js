// server/app.js
const express = require('express')
prpl = require('prpl-server');
const app = express();

app.get('/api/launch', (req, res, next) => res.send('Launched));
let polyConfigFile = require("./build/polymer.json");
app.get('/*', prpl.makeHandler('server/build',polyConfigFile));
app.listen(3000, () => console.log('Express + prpl-server app listening on port 3000!'));