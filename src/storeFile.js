
import {
    create
} from 'ipfs-http-client'

export async function addFile(ipfsGateWay, authHeader, base64content) {

    // 1. Create IPFS instant
    const ipfs = create({
        url: `${ipfsGateWay}/api/v0`,
        headers: {
            authorization: `Basic ${authHeader}`
        }
    });

    const {
        cid
    } = await ipfs.add(Buffer.from(base64content,'base64'))

    const fileStat = await ipfs.files.stat("/ipfs/" + cid.toString())

    return {
        cid: cid.toString(),
        size: fileStat.cumulativeSize
    };
}

