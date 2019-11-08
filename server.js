const express = require('express');
const helmet = require('helmet');

const db = require('./data/db-config.js');

const server = express();

server.use(helmet());
server.use(express.json());

//test server functionality
server.get('/', (req, res) => {
    res.send(`IT'S WORKING! IT'S WORKING!!!`);
});

server.post('/resources', (req, res) => {
    db('resources').insert(req.body)
        .then(id => {
            res.status(201).json(id);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.get('/resources', (req, res) => {
    db('resources')
        .then(resources => {
            res.status(200).json(resources);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});





module.exports = server;