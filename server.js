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

server.post('/projects', (req, res) => {
    db('projects').insert(req.body)
    .then(id => {
        res.status(201).json(id);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

server.get('/projects', (req, res) => {
db('projects')
    .then(projects => {
        var formatted = projects.map(project => ({...project, completed: Boolean(project.completed)}));
        res.status(200).json(formatted);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

server.post('/tasks', (req, res) => {
    db('tasks').insert(req.body)
    .then(id => {
        res.status(201).json(id);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

server.get('/tasks', (req, res) => {
    /*
    select t.*, p.name as project_name, p.description as project_description
    from tasks as t
    join projects as p on t.project_id = p.id;
    */

    db.select('t.*', 'p.name as project_name',' p.description as project_description')
        .from('tasks as t')
        .join('projects as p', 't.project_id', '=', 'p.id')
        .then(tasks => {
            var formatted = tasks.map(task => ({...task, completed: Boolean(task.completed)}));
            res.status(200).json(tasks);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// quick and dirty endpoint for populating project_resources
server.post('/project_resources', (req, res) => {
    db('project_resources')
        .insert(req.body)
        .then(id => {
            res.status(201).json(id);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

server.get('/projects/:id', (req, res) => {
    const id = req.params.id;

    db('projects')
        .where({ id })
        .first()
        .then(project => {
            db('tasks')
                .where({ project_id: id})
                .then(tasks => {
                // select r.*
                // from project_resources as pr
                // join resources as r on r.id = pr.resource_id
                // where pr.project_id = 1;

                    db.select('r.*')
                        .from('project_resources as pr')
                        .join('resources as r', 'r.id', '=', 'pr.resource_id')
                        .where('pr.project_id', '=', id)
                        .then(resources => {
                            console.log(resources);
                            res.status(200).json({
                                ...project,
                                completed: Boolean(project.completed),
                                tasks: tasks.map(task => ({
                                    id: task.id, 
                                    description: task.description,
                                    notes: task.notes,
                                    completed: Boolean(task.completed)                        
                                    })),
                                resources: resources
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json(err);  
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);  
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);  
        });
});



module.exports = server;