const library = (function () {
    const axios = require('axios');

    const PORT = 9007;
    const MAX_EVENTS = 8;

    // const BASE_URL = "https://www.vocalcoin.com"
    // TODO: add https
    const BASE_URL = `http://172.31.56.84:${PORT}`;
    const socket = require('socket.io-client')(BASE_URL);

    const getRandom = (items) => {
        return items[Math.floor(Math.random()*items.length)];
    }

    const formatDateTimeMs = (timeMs) => {
        const date = new Date(timeMs);
        return `${date.toDateString()} ${date.toLocaleTimeString()}`;
    }

    // Get issues within the bounding box.
    // TODO: update to take 4 bo points.
    function getIssuesForRegion(lat, lng) {
        const url = `${BASE_URL}/api/issues/region/${lat}/${lng}`;
        return axios.get(url).then(response => response.data);
    }

    function getIssueDetails(issueId) {
        const url = `${BASE_URL}/api/issue/${issueId}`;
        return axios.get(url).then(response => response.data);
    }

    function getIssuesForUser(userId) {
        const url = `${BASE_URL}/api/issues/user/${userId}`;
        return axios.get(url).then(response => response.data);
    }

    function postVocal(userId) {
        const url = `${BASE_URL}/api/vocal/add`;
        return axios.post(url, {
            userId: userId
        }).then(response => {
            const data = response.data;
            return data;
        });
    }

    function postIssue(userId, issue) {
        const url = `${BASE_URL}/api/issue`;
        return axios.post(url, {
            userId: userId,
            issue: issue,
        }).then(response => {
            const data = response.data;
            const eventName = "New Issue added: " + JSON.stringify(data);
            socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
                console.log('action ack', data);
            });
            return data;
        });
    }

    function postVote(userId, vote) {
        const url = `${BASE_URL}/api/vote`;
        return axios.post(url, {
            userId: userId,
            vote: vote
        }).then(response => {
            const data = response.data;
            const eventName = "New Vote added: " + JSON.stringify(data);
            socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
                console.log('action ack', data);
            });
            return data;
        });
    }

    function getSocketEvents(count) {
        if (!count) {
            count = MAX_EVENTS;
        }
        const url = `${BASE_URL}/api/events/${count}`;
        return axios.get(url).then(response => response.data);
    }

    // TODO: return axios promises for the requests below.

    function getTransactionHistory(user) {
        const userId = user.userId;
        return null;
    }

    function getAddress(user) {
        return null;
    }

    function postAddress(user) {
        return null;
    }

    return {
        postVote: postVote,
        postIssue: postIssue,
        postAddress: postAddress,
        getIssueDetails: getIssueDetails,
        getIssuesForRegion: getIssuesForRegion,
        getIssuesForUser: getIssuesForUser,
        getSocketEvents: getSocketEvents,
        getRandom: getRandom,
        getTransactionHistory: getTransactionHistory,
        getAddress: getAddress,
        formatDateTimeMs: formatDateTimeMs,
        socket: socket
    }

})();
module.exports = library;
