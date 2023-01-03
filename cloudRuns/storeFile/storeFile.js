const IPFS = require('ipfs-core')

async function main() {
    const ipfs = await IPFS.create()
    const {
        cid
    } = await ipfs.add('Hello world')
    console.log(cid)
}

main()