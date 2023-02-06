import {
    create
} from 'ipfs-http-client'

import simpleNodeLogger from 'simple-node-logger'

import hre from 'hardhat'

const log = simpleNodeLogger.createSimpleLogger({
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
})

export async function addFile(ipfsGateWay, authHeader, base64content) {
    try {
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
    }
}catch(error) {
    return(error.message)
}
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
export async function quickMint(options) {
    if (!('ipfsGateWay' in options && 'authHeader' in options&&'contractName' in options && 'contractAddr' in options && 'fileData' in options && 'fileName' in options && 'description' in options && 'destination' in options)) {
        return('incomplete parameters forwarded')
    }
    let {cid,size}=await addFile(options.ipfsGateWay,options.authHeader,options.fileData)
    let jsonData={
        name:options.fileName,
        description: options.description,
        image:cid
    }
    let tokenUri=await createUri(options.ipfsGateWay,options.authHeader,jsonData)
    let nftData=await mintNft(options.contractName,options.contractAddr,tokenUri,options.destination)
    return(nftData)

}

export async function mintNft(contractName, contractAddress, uriCid,
    destinationAddress ) {
    try {

        const cidString = uriCid.toString()

        const NFT = await hre.ethers.getContractFactory(contractName);

        const contract = NFT.attach(contractAddress);
        log.info({
            contractAddress,
            contractName
        })
        // console.log({ hre })
        // console.log({ NFT })
        // console.log({ contract })


        log.info(`Minting new  ${contractName} token for ${destinationAddress}`)

        const tokenUri = `https://ipfs.io/ipfs/${cidString}`;


        log.trace({
            destinationAddress,
            tokenUri
        })
        const sendTo = await hre.ethers.utils.getAddress(destinationAddress);
        log.trace({
            sendTo
        });

        await sleep(100)
        let mintOk = false
        let attempts = 0
        while (!mintOk) {
            try {
                attempts++
                const options = {
                    gasPrice: hre.ethers.utils.parseUnits('100', 'gwei'),  // This is for error testing
                    gasLimit: 1000
                }
                const txn = await contract.safeMint(sendTo, tokenUri);

                log.info('Waiting on txn ', txn.hash);
                const receipt = await hre.ethers.provider.waitForTransaction(txn.hash);
                const tokenId = parseInt(receipt.logs[0].topics[3], 16);

                log.info("Minted token ID ", tokenId, " at ", txn.hash);
                mintOk = true
                return ({
                    txn,
                    tokenId
                });

            } catch (err) {
                log.error(`${err.message} while minting - attempt ${attempts}`)
                if (attempts > 5) {
                    throw Error(err)
                }
            }
        }

    } catch (error) {
        console.error(error)
        log.error(`${error.message} while minting NFT`)
        log.info(error.stack)
        throw new Error(error)
    }

}