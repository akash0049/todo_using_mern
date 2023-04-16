const redis = require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.connect().then(() => {
    console.log("Redis connected !!");
}).catch((err) => {
    console.log('Redis Server Error', err.message);
});

module.exports = client;