//SPDX-License-Identifier : MIT
pragma solidity ^0.8.0;

contract Transactions {
    //仮想通貨の受け渡し
    struct TransferStruct{
        address sender;
        address reciever;
        uint amount;
    }

    TransferStruct[] transactions;
    
    event Transfer(address from, address reciever , uint amount);

    function addToBlockChain(address payable receiver , uint amount) public {
        transactions.push(TransferStruct(msg.sender, receiver , amount));
        emit Transfer(msg.sender,receiver,amount);
    }
}
