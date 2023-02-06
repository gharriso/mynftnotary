import express from 'express'

import bodyParser from 'body-parser'

import simpleNodeLogger from 'simple-node-logger'

import { addFile, createUri, mintNft,quickMint } from './storeFile.mjs'

const log = simpleNodeLogger.createSimpleLogger({
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
})

const app = express()
const jsonParser = bodyParser.json({ limit: '50mb' })

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

app.post('/createUri', jsonParser, async (req, res) => {
    if ('data' in req.body) {
        let response = await createUri(ipfsGateway, authHeader, req.body.data)
        res.status(200).json(response)
    } else {
        res.status(404).send('No Data in payload')
    }
});

app.post('/storeFile', jsonParser, async (req, res) => {
    if ('data' in req.body) {
        let response = await addFile(ipfsGateway, authHeader, req.body.data)
        res.status(200).json(response)
    } else {
        res.status(404).send('No Data in payload')
    }
});

app.post('/quickMint', jsonParser, async (req, res) => {
    if (!('contractAddr' in process.env)) {
        return('No contractAddr  in environment')
    }
    if (!('contractName' in process.env)) {
        return('No contractName  in environment' )
    }
    if (!('defaultDestination' in process.env)) {
        return('No defaultDestination  in environment')
    }
    if ('data' in req.body && 'name' in req.body && 'description' in req.body) {
        const parameters={
            ipfsGateWay:ipfsGateway,
            authHeader,
            contractName:process.env.contractName,
            contractAddr:process.env.contractAddr,
            fileData:req.body.data,
            fileName:req.body.name ,
            description:req.body.description,
            destination:process.env.defaultDestination
        }
   
        let response = await quickMint(parameters)
        res.status(200).json(response)
    } else {
        res.status(404).send('missing data,name or description in request body')
    }
});








