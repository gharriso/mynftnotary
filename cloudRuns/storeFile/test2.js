import {
    create
} from 'ipfs-http-client'

async function main() {
    let authHeader
    let ipfsGateway
    try {
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
        const result = await addFile(ipfsGateway, authHeader, "hello world")
        console.log(result)
        process.exit(0)
    } catch (error) {
        console.log(error.stack)
    }
}



async function addFile(ipfsW3GW, authHeader, fileContent) {
    // 0. Construct web3 auth header
    // Now support: ethereum-series, polkadot-series, solana, elrond, flow, near, ...
    // Let's take ethereum as example

    //const ipfsAuthHeader = Buffer.from(authHeader).toString('base64');
    const ipfsAuthHeader = authHeader
    // 1. Create IPFS instant
    const ipfs = create({
        url: `${ipfsW3GW}/api/v0`,
        headers: {
            authorization: `Basic ${ipfsAuthHeader}`
        }
    });
    console.log(ipfs)
    // 2. Add file to ipfs
    const {
        cid
    } = await ipfs.add(fileContent);
    console.log(cid)

    // 3. Get file status from ipfs
    const fileStat = await ipfs.files.stat("/ipfs/" + cid.toString());

    return {
        cid: cid.path,
        size: fileStat.cumulativeSize
    };
}

main()