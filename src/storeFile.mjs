import {
    create
} from 'ipfs-http-client'

import simpleNodeLogger from 'simple-node-logger'

const log = simpleNodeLogger.createSimpleLogger({
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
})

export async function addFile(ipfsGateWay, authHeader, base64content) {

    const ipfs = create({
        url: `${ipfsGateWay}/api/v0`,
        headers: {
            authorization: `Basic ${authHeader}`
        }
    });

    const {
        cid
    } = await ipfs.add(Buffer.from(base64content, 'base64'))

    const fileStat = await ipfs.files.stat("/ipfs/" + cid.toString())

    return {
        cid: cid.toString(),
        size: fileStat.cumulativeSize
    };
}

export async function createUri(ipfsGateWay, authHeader, jsonData) {
    try {
        const ipfs = create({
            url: `${ipfsGateWay}/api/v0`,
            headers: {
                authorization: `Basic ${authHeader}`
            }
        });

        const {
            cid
        } = await ipfs.add(JSON.stringify(jsonData))

        const fileStat = await ipfs.files.stat("/ipfs/" + cid.toString())

        return {
            cid: cid.toString(),
            size: fileStat.cumulativeSize
        };
    } catch (error) {
        log.error(error.stack)
        return (error.message)
    }
}