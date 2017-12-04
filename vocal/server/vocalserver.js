'use strict';
// Server code for vocal project.
// Author: Chris Buonocore (2017)
// License: Apache License 2.0

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const pg = require('pg');
const path = require('path');

// Variable and Server Setup //
const prod = false;

// custom libraries.
const vocal = require('./vocal');
const contract = require('./contract');

const vocalContract = contract.vocalContract;

const dbUser = process.env.ADMIN_DB_USER;
const dbPass = process.env.ADMIN_DB_PASS;
const dbName = 'vocal';
const connectionString = process.env.VOCAL_DATABASE_URL || `postgres://${dbUser}:${dbPass}@localhost:5432/${dbName}`;
console.log('connectionString', connectionString);

const pool = new pg.Pool({
    connectionString: connectionString,
})

const PORT = 9007;

const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const whitelist = ['https://vocalcoin.com', 'https://www.vocalcoin.com'];
app.use(cors({ origin: whitelist }));

// Test Ethereum Network (INFURAnet)
const infuraTestNet = "https://infuranet.infura.io/";
const infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;
const infuraMnemonic = process.env.INFURA_MNEMONIC;

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

// Endpoints //

app.get('/api/hello', (req, res) => {
    return res.json("hello world");
});

/* Map endpoints */

api.get('/api/issues/region', (req, res) => {

});

app.post('/api/vote', (req, res) => {
    const body = req.body;
    const vote = body.vote;
    const query = vocal.insertVoteQuery(vote);

    pool.query(query, (err, result) => {
        console.log('postVote', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

app.post('/api/issue', (req, res) => {
    const body = req.body;
    const issue = body.issue;
    const query = vocal.insertIssueQuery(issue);

    pool.query(query, (err, result) => {
        console.log('postIssue', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

app.post('/api/vocal/add', (req, res) => {
    const body = req.body;
    const userId = body.userId;
    if (!userId) {
        return res.status(400).json({ message: "userId must be defined" });
    }
    // calculate the amount of vocal to credit based on the userId (TODO: and other params).
    const amount = vocal.calculateVocalCredit(userId);
    const query = vocal.addVocalQuery(userId, amount);

    pool.query(query, (err, result) => {
        console.log('vocal add', err, count, result)
        if (err) {
            console.error('vocal add error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

/* Query methods */

// TODO: each request below should do an address lookup (based on the past in userId) to find the appropriate address to credit or find the balance for.
// TODO: this request queries the BLOCKCHAIN for the current balance.
app.get('/api/balance', (req, res) => {
    const userId = req.params.userId;
    // TODO: query the blockchain (instead of the local db) for the most recent balance for the user.
    pool.query(`SELECT * FROM balance where userId='${userId}'ORDER BY time DESC limit 1`, (err, result) => {
        console.log('balance', err, count, result)
        if (err) {
            console.error('balance error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

// Check if the given userId param exists in the DB and contains a non-null address.
app.get('/api/address', (req, res) => {
    const userId = req.params.userId;
    pool.query(`SELECT * FROM users where userId='${userId}'`, (err, result) => {
        console.log('verify address', err, count, result)
        if (err) {
            console.error('verify address', err);
            return res.status(500).json(err);
        }

        if (result.rows) {
            const userRow = result.rows[0];
            // TODO: use an actual ethereum address validator (rather than isBlank).
            const address = userRow['address']
            const hasAddress = !isBlank(address);
            if (hasAddress) {
                return res.json(address)
            }
        }

        // pool.end()
        return res.json("");
    });
});

app.post('/api/address/update', (req, res) => {
    const body = req.body;
    const userId = body.userId;
    const address = body.address;

    const query = vocal.updateAddressQuery(userId, address)
    // TODO: update this to change the registered public eth address of the give user (indicated by their userId).
    return res.json(true);

});

// TODO: query the blockchain for the transactions submitted by the given userId (using the address lookup).
app.get('/api/transactions', (req, res) => {
    const userId = req.params.userId;
    pool.query(`SELECT * FROM transactions where userId='${userId}'`, (err, result) => {
        console.log('transactions', err, count, result)
        if (err) {
            console.error('transactions error', err);
            return res.status(500).json(err);
        }
        // pool.end()
        return res.json(result.rows);
    });
});

// Socket IO handlers //

io.origins('*:*') // for latest version
io.on('connection', function (client) {
    client.on('connect', function () {
        console.log('user connect');
    });
    client.on('action', function (event) {
        const query = vocal.insertEventQuery(event.name, event.time);
        pool.query(query);
        console.log('action', JSON.stringify(event));
        io.emit('incoming', event)
    });
    client.on('disconnect', function () {
        console.log('user disconnect');
    });
});

// DB Connection and Server start //

pool.connect((err, client, done) => {
    if (err) {
        console.error('postgres connection error', err)
        if (prod) {
            console.error('exiting')
            return;
        }
        console.error('continuing with disabled postgres db');
    }

    server.listen(PORT, () => {
        console.log('Express server listening on localhost port: ' + PORT);
    });
})