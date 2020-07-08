const express = require('express');
const apiRouter = express.Router();

const { createMeeting, getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId, deleteAllFromDatabase } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

// Minions routes
apiRouter.use('/minions/:id', (req, res, next) => {
        // Could need to refactor this as getFromDatabaseById() is returning 'undefined' rather than -1 for an invalid id.
    let minion = getFromDatabaseById('minions', req.params.id.toString());
    if (!minion) {
        res.status(404).send('Invalid id');
    } else {
        req.minion = minion;
        next();
    }
});

apiRouter.use(['/minions', '/minions/:id'], (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.method === 'PUT' && !req.body.id) {
            res.status(400).send('Please provide the id for the minion');
        } else if (typeof req.body.name !== 'string' || typeof req.body.title !== 'string' || typeof req.body.weaknesses !== 'string') {
            res.status(400).send('Please provide values for the name, title and weaknesses of the minion - all as strings');
        }
    }
    next();
});

apiRouter.get('/minions', (req, res, next) => {
    let minions = getAllFromDatabase('minions');
    res.send(minions);
});

apiRouter.post('/minions', (req, res, next) => {
    req.body.salary = Number(req.body.salary);
    const newMinion = req.body;
    addToDatabase('minions', newMinion);
    res.status(201).send(newMinion);
});

apiRouter.get('/minions/:id', (req, res, next) => {
    res.send(req.minion);
});

apiRouter.put('/minions/:id', (req, res, next) => {
    if (req.params.id.toString() !== req.body.id.toString()) {
        res.status(400).send('The id of this minion cannot be changed.');
    } else {
        let minion = updateInstanceInDatabase('minions', req.body);
        if (!minion) {
            res.status(400).send('Bad request');
        } else {
            res.status(200).send(minion);
        }
    }
});

apiRouter.delete('/minions/:id', (req, res, next) => {
    let minion = deleteFromDatabasebyId('minions', req.params.id.toString());
    res.status(204).send();
});

// Ideas routes
apiRouter.use(['ideas', '/ideas/:id'], (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (req.method === 'PUT' && (!req.body.id || !req.params.id)) {
            res.status(404).send('Please provide a valid id for the idea');
        } else if (typeof req.body.weeklyRevenue !== 'number' || typeof req.body.numWeeks !== 'number') {
            res.status(400).send('Please provide values for the weeklyRevenue and numWeeks of the idea - both as numbers')
        } else if (typeof req.body.name !== 'string' || typeof req.body.description !== 'string') {
            res.status(400).send('Please provide values for the name and description of the idea - both as strings');
        }
    }
    next();
});

apiRouter.use('/ideas/:id', (req, res, next) => {
    // Could need to refactor this as getFromDatabaseById() is returning 'undefined' rather than -1 for an invalid id.
    let idea = getFromDatabaseById('ideas', req.params.id.toString());
    if (!idea) {
        res.status(404).send('Invalid id');
    } else {
        req.idea = idea;
        next();
    }
});

apiRouter.get('/ideas', (req, res, next) => {
    let ideas = getAllFromDatabase('ideas');
    res.send(ideas);
});

apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = req.body;
    newIdea.weeklyRevenue = Number(newIdea.weeklyRevenue);
    newIdea.numWeeks = Number(newIdea.numWeeks);
    addToDatabase('ideas', newIdea);
    res.status(201).send(newIdea);
});

apiRouter.get('/ideas/:id', (req, res, next) => {
    res.send(req.idea);
});

apiRouter.put('/ideas/:id', checkMillionDollarIdea, (req, res, next) => {
    if (req.params.id.toString() !== req.body.id.toString()) {
        res.status(400).send('The id of this minion cannot be changed.');
    } else {
        let idea = updateInstanceInDatabase('ideas', req.body);
        idea.id = idea.id.toString();
        res.status(200).send(idea);
    }
});

apiRouter.delete('/ideas/:id', (req, res, next) => {
    deleteFromDatabasebyId('ideas', req.params.id.toString());
    res.status(204).send();
});

// Meetings routes
apiRouter.get('/meetings', (req, res, next) => {
    let meetings = getAllFromDatabase('meetings');
    res.send(meetings);
});

apiRouter.post('/meetings', (req, res, next) => {
    let meeting = createMeeting();
    if (!meeting) {
        res.status(500).send('Your meeting could not be created');
    } else {
        addToDatabase('meetings', meeting);
        res.status(201).send(meeting);
    }
});

apiRouter.delete('/meetings', (req, res, next) => {
    deleteAllFromDatabase('meetings');
    res.status(204).send('All meetings cancelled');
});

module.exports = apiRouter;
