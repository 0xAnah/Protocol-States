"use strict"
const { ethers } = require('hardhat');


async function main() {
    const ProtocolStateFactory = await ethers.getContractFactory("ProtocolStates");
    const protocolStatesContract = await ProtocolStateFactory.deploy(9);

    console.log(await protocolStatesContract.getContractState());
}

main()
    .then(() => {
        console.log("Worked");
    })
    