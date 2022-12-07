const redis = require('ioredis')

const client = redis.createClient({
    port:6379,
    host:"127.0.0.1"
})

client.on('connect', ()=>{
    console.log('Client connected to redis')
})

client.on('error', (err)=>{
    console.log(err.message)
})

client.on('ready', ()=>{
    console.log('redis client ready to use')
})

client.on('end', ()=>{
    console.log('redis client disconnected')
})

process.on('SIGINT', ()=>{
    console.log('disconnecting from redis')
    client.quit()
})

module.exports = client