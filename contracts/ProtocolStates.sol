//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ProtocolStates {
    enum States {
        AcceptingBlindedBids,
        RevealBids,
        AnotherStage,
        AreWeDoneYet,
        Finished
    }

    States private contractState;
    address public immutable owner;

    constructor(uint256 contractState_) {
        owner = msg.sender;
        contractState = States(contractState_);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function changeState(States _newState) public onlyOwner {
        contractState = _newState;
    }

    function  incrementState() public onlyOwner {
        contractState = States(uint256(contractState) + 1);
    }

    function  decrementState() public onlyOwner {
        contractState = States(uint256(contractState) - 1);
    }

    function getContractState() public view returns(string memory) {
        States contractState_ = contractState;
        if(contractState_ == States.AcceptingBlindedBids)
            return "Accepting Blinded Bids";
        else if(contractState_ == States.RevealBids)
            return "Reveal Bids";
        else if(contractState_ == States.AnotherStage)
            return "Another Stage";
        else if(contractState_ == States.AreWeDoneYet)
            return "Are We Done Yet";
        else
            return "Finished";
    }
}