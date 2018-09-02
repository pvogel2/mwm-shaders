const express = require('express');
const app = express();
const fs = require('fs');
const url = require('url');

app.get('/', (req, res) => res.sendFile(__dirname + '/res/html/index.html'));
app.use('/res/js/three/', express.static('node_modules/three/'));
app.use('/res/js/mdc/', express.static('node_modules/material-components-web/dist/'));
app.use('/res/css/mdc/', express.static('node_modules/material-components-web/dist/'));
app.use('/res/js/mwm/', express.static('node_modules/mwm-renderer/dist/'));
app.use('/res/js/assets/', express.static('res/js/'));
app.use('/res/obj/', express.static('res/obj/'));
app.use('/res/css/', express.static('res/css/'));
app.use('/res/html/', express.static('res/html/'));
app.use('/res/shaders/', express.static('res/shaders/'));
app.use('/res/scene/', express.static('res/scene/'));

app.listen(3000, () => console.log('App listening on port 3000!'));

