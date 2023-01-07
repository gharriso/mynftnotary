import express from 'express'

import bodyParser from 'body-parser'

import simpleNodeLogger from 'simple-node-logger'

import {addFile} from './storeFile.js'

const log = simpleNodeLogger.createSimpleLogger({
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
})

const app = express()
const jsonParser = bodyParser.json()

let authHeader
let ipfsGateway

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
    log.info(`listening on port ${port}`);
    if ('authHeader' in process.env) {
        authHeader = process.env.authHeader
    } else {
        console.error("no authHeader in process.env")
        process.exit(1)
    }
    if ('ipfsGateway' in process.env) {
        ipfsGateway = process.env.ipfsGateway
    } else {
        console.error("no ipfsGateway in process.env")
        process.exit(1)
    }
});

app.post('/storeFile', jsonParser, async (req, res) => {
    if ('data' in req.body)  {
    let response= await addFile(ipfsGateway, authHeader, req.body.data)
    res.status(200).json(response)
    } else {
        res.status(404).send('No Data in payload')
    }
});







