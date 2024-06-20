import { useEffect, useState } from "react";
import PrimaryButton from "@/components/Button";
import { useWeb3 } from "@/context/useWeb3";

export default function Home() {
    const {
        address,
        getUserAddress,
        sendCUSD,
        getBalance,
        checkIfTransactionSucceeded
    } = useWeb3();
    const [signingLoading, setSigningLoading] = useState(false);
    const [tx, setTx] = useState<any>(undefined);
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [balance, setBalance] = useState<string>("");
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        getUserAddress().then(async () => {
            if (address) {
                const userBalance = await getBalance(address);
                setBalance(userBalance);
            }
        });
    }, [address]);

    useEffect(() => {
        const checkStatus = async () => {
            if (tx) {
                const status = await checkIfTransactionSucceeded(tx.transactionHash);
                setTransactionStatus(status ? "Successful" : "Failed");
            }
        };
        checkStatus();
    }, [tx]);

    const sendingCUSD = async () => {
        if (recipient && amount) {
            const amountInCUSD = parseFloat(amount);
            const balanceInCUSD = parseFloat(balance);
            if (amountInCUSD > balanceInCUSD) {
                setErrorMessage("Insufficient balance to complete the transaction.");
                return;
            }
            setSigningLoading(true);
            setErrorMessage(null);
            try {
                const tx = await sendCUSD(recipient, amount);
                setTx(tx);
                const userBalance = await getBalance(address!);
                setBalance(userBalance);
            } catch (error) {
                console.log(error);
            } finally {
                setSigningLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            {address ? (
                <>
                    <div className="grid grid-cols-1 gap-6">
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Amount to Send"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errorMessage && (
                            <div className="text-red-600 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <PrimaryButton
                            loading={signingLoading}
                            onClick={sendingCUSD}
                            title="Send cUSD"
                            widthFull
                        />
                    </div>
                    <div className="mt-6">
                        <div className="text-center">
                            <span className="font-semibold">Receiver:</span> {recipient}
                        </div>
                        <div className="text-center mt-2">
                            <span className="font-semibold">Amount:</span> {amount} cUSD
                        </div>
                    </div>
                    {transactionStatus && (
                        <div className="mt-4 text-center text-lg font-semibold">
                            Transaction Status: {transactionStatus}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-xl font-semibold text-gray-700">
                    Please connect your wallet to proceed.
                </div>
            )}
            {tx && (
                <div className="mt-4 text-center text-lg font-semibold">
                    Tx Completed: {tx.transactionHash.substring(0, 6)}...
                    {tx.transactionHash.substring(tx.transactionHash.length - 6)}
                </div>
            )}
        </div>
    );
}
