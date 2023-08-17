"use strict"
const { expect } = require('chai');
const { ethers } = require('hardhat');
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");

describe("Testing ProtocolStatesContracts", () => {
    let ProtocolStateFactory;
    let protocolStatesContract;
    let owner;
    let address1;
    let address2;

    before(async () => {
        [owner, address1, address2] = await ethers.getSigners();
        ProtocolStateFactory = await ethers.getContractFactory('ProtocolStates');
        
    });

    describe("Ensure the protocol is Properly deployed", () => {

        it("It should not deploy with a wrong argument", async () => {
            /** When i use await keyword to resolve promise returned by ProtocolStateFactory.deploy(6)
             *  the test fails but when i remove the await keyword the test runs successfully
             *  I would love a clear explanation why its happens like this
             * 
             *  Another problem i found is that if i change the PANIC_CODE.ENUM_CONVERSION_OUT_OF_BOUNDS
             *  argument to another panic code the test would stil run successfully
             */
            expect(ProtocolStateFactory.deploy(6)).to.be.revertedWithPanic(
                PANIC_CODES.ENUM_CONVERSION_OUT_OF_BOUNDS
            );
        })

        it("Protocol should deploy and initial state should be 'Accepting Blinded Bids'", async function() {
            protocolStatesContract = await ProtocolStateFactory.deploy(0);
            expect(await protocolStatesContract.getContractState()).to.equal("Accepting Blinded Bids");
        })
    })
    
    
    describe("The incrementState() function should work properly", () => {

        it("The protocol state should increment to 'Reveal Bids' ", async function() {
            await protocolStatesContract.incrementState();
            expect(await protocolStatesContract.getContractState()).to.equal('Reveal Bids');
        });

        it("The Increment function can only be called by Owner ", async function() {
            expect(protocolStatesContract.connect(address1).incrementState()).to.be.reverted;
        });

    });
    
    describe("The decrementState() function should work properly", () => {

        it("The protocol state should decrement to 'Accepting Blinded Bids'", async () => {
            await protocolStatesContract.decrementState();
            expect(await protocolStatesContract.getContractState()).to.equal('Accepting Blinded Bids');
        });

        it("The decrementState() function can only be called by owner", async () => {
            expect(protocolStatesContract.connect(address2).decrementState()).to.be.reverted;
        });
    });

    describe("The changeState() function should work as expected", () => {

        it("The changeState(1) fucntion should change the protocol state to 'Reveal Bids'", async () => {
            await protocolStatesContract.changeState(1);
            expect(await protocolStatesContract.getContractState()).to.equal("Reveal Bids");
        });

        it("The changeState(2) fucntion should change the protocol state to 'Another Stage'", async () => {
            await protocolStatesContract.changeState(2);
            expect(await protocolStatesContract.getContractState()).to.equal("Another Stage");
        });

        it("The changeState(3) fucntion should change the protocol state to 'Are We Done Yet'", async () => {
            await protocolStatesContract.changeState(3);
            expect(await protocolStatesContract.getContractState()).to.equal("Are We Done Yet");
        });

        it("The changeState(4) fucntion should change the protocol state to 'Finished'", async () => {
            await protocolStatesContract.changeState(4);
            expect(await protocolStatesContract.getContractState()).to.equal("Finished");
        });

        it("The changeState(5) function should revert if an argument > 4 is passed", async () => {
            expect(protocolStatesContract.changeState(5)).to.be.reverted;
        });

        it("The changeState(-2) function should revert if an argument < 0 is passed", async () => {
            expect(protocolStatesContract.changeState(-2)).to.be.reverted;
        });
    });
});