import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { contractABI, contractAddress } from "../utils/connect";

export const TransactionContext = createContext();

// Smart contractを取得する関数
const getSmartContract = async () => {
    try {
        if (!window.ethereum) {
            alert("メタマスクをインストールしてください。");
            return null;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(signer);

        const transactionContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        console.log(provider, signer, transactionContract);
        return transactionContract;
    } catch (error) {
        console.error("Error in getSmartContract:", error);
        alert("スマートコントラクトの取得に失敗しました。");
        return null;
    }
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [inputFormData, setInputFormData] = useState({
        addressTo: "",
        amount: "",
    });

    // フォームデータを更新する関数
    const handleChange = (e, name) => {
        setInputFormData((prevInputFormData) => ({
            ...prevInputFormData,
            [name]: e.target.value,
        }));
    };

    // メタマスクのウォレットが接続されているか確認する関数
    const checkMetamaskWalletConnected = async () => {
        if (!window.ethereum) return alert("メタマスクをインストールしてください。");

        try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            console.log(accounts);

            if (accounts.length) {
                setCurrentAccount(accounts[0]);  // アカウントがある場合、currentAccount を更新
            } else {
                alert("ウォレットが接続されていません。");
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
            alert("ウォレットの接続確認中にエラーが発生しました。");
        }
    };

    // トランザクションを送信する関数
    const sendTransaction = async () => {
        if (!window.ethereum) return alert("メタマスクをインストールしてください。");
        
        if (!currentAccount) {
            return alert("ウォレットが接続されていません。");
        }

        console.log("sendTransaction");

        try {
            const transactionContract = await getSmartContract();
            if (!transactionContract) return alert("スマートコントラクトが取得できませんでした。");

            const { addressTo, amount } = inputFormData;
            const parsedAmount = ethers.parseEther(amount);

            const transactionParameters = {
                from: currentAccount,
                to: addressTo,
                value: parsedAmount.toString(),
                data: "0x",
            };

            console.log("Transaction Parameters:", transactionParameters);

            try {
                const txHash = await window.ethereum.request({
                    method: "eth_sendTransaction",
                    params: [transactionParameters],
                });

                console.log(`Transaction Hash: ${txHash}`);

                const transactionHash = await transactionContract.addToBlockChain(
                    addressTo,
                    parsedAmount
                );

                console.log(`ロード中・・・${transactionHash.hash}`);
                await transactionHash.wait();
                console.log(`送金に成功！${transactionHash.hash}`);
            } catch (requestError) {
                console.error("Error in eth_sendTransaction:", requestError);
                alert("トランザクション送信時にエラーが発生しました。");
            }
        } catch (error) {
            console.error("Error sending transaction:", error);
            alert("トランザクションの処理中にエラーが発生しました。");
        }
    };

    useEffect(() => {
        checkMetamaskWalletConnected();
    }, []);

    // ウォレットを接続する関数
    const connectWallet = async () => {
        if (!window.ethereum) return alert("メタマスクをインストールしてください。");

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log(accounts[0]);

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("ウォレットの接続中にエラーが発生しました。");
        }
    };

    return (
        <TransactionContext.Provider value={{ connectWallet, sendTransaction, handleChange, inputFormData }}>
            {children}
        </TransactionContext.Provider>
    );
};

export default TransactionProvider;
