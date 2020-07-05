const express = require('express');
const apiRouter = express.Router();

const { createMeeting, getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId, deleteAllFromDatabase } = require('./db');

// Minions routes
apiRouter.get('/minions', (req, res, next) => {
    let minions = getAllFromDatabase('minions');
    res.send(minions);
});

apiRouter.post('/minions', (req, res, next) => {
    if (typeof req.body.name !== 'string' || typeof req.body.title !== 'string' || typeof req.body.weaknesses !== 'string' || typeof req.body.salary !== 'string') {
        res.status(400).send('Please provide values for the name, title, weaknesses and salary of the new minion - all as strings');
    } else {
        req.body.salary = Number(req.body.salary);
        const newMinion = req.body;
        addToDatabase('minions', newMinion);
        res.send(newMinion);
    }
});

apiRouter.get('/minions/:id', (req, res, next) => {
    // Could need to refactor this as getFromDatabaseById() is returning 'undefined' rather than -1 for an invalid id.
    let minion = getFromDatabaseById('minions', req.params.id.toString());
    if (!minion) {
        res.status(404).send('Invalid id');
    } else {
        res.send(minion);
    }
});

apiRouter.put('/minions/:id', (req, res, next) => {
    
});

// Ideas routes
apiRouter.get('/ideas', (req, res, next) => {
    let ideas = getAllFromDatabase('ideas');
    res.send(ideas);
});

// Meetings routes
apiRouter.get('/meetings', (req, res, next) => {
    let meetings = getAllFromDatabase('meetings');
    res.send(meetings);
});

module.exports = apiRouter;
