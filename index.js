import { Wallet, formatEther, JsonRpcProvider, parseEther, parseUnits } from "ethers";
import fs from 'fs'

//========================== lu edit bagian ini dah ==============================
const pk = "xxxxxxxxxxx"; //isi Privatekey
const RPC_URL = 'https://rpc.sepolia.org'; //isi RPC
const GWEI = '30'; //isi GWEI (sesuaikan)
const amount = '0.001'; //isi mau send brp eth
//================================================================================

const provider = new JsonRpcProvider(RPC_URL);

async function transferFunds(privateKey, toAddress, amount) {
    try{
        const wallet = new Wallet(privateKey, provider);
        // Construct the transaction parameters
        const transaction = {
            to: toAddress,
            gasPrice: parseUnits(GWEI, 'gwei'),
            value: parseEther(amount)
        };
        // Send the transaction
        const tx = await wallet.sendTransaction(transaction);
        return tx
    } catch (err) {
        return err
    }
}

(async () => {
    try {
        fs.readFile('wallet.txt', async function(err, data) {
            if (err) throw err;
            const array = data.toString().replace(/\r/g, "").split('\n')
            for(let i = 0; i < array.length; i++) {
                    console.log('');
                    const address = array[i]
                    let transferResult = true
                    console.log(`Transfering ${amount} to ${address}!`)
                    transferResult = await transferFunds(pk, address, amount);
                    let BalanceData = 0
                    if (transferResult.hash) {
                        let Balance = parseFloat(formatEther(await provider.getBalance(address)));
                        BalanceData += Balance;
                        console.log(`Please Wait....`)
                        do {
                            Balance = parseFloat(formatEther(await provider.getBalance(address)));
                        } while (Balance < BalanceData);
                        console.log(`Success https://sepolia.etherscan.io/tx/${transferResult.hash}`)
                    } else if (transferResult.action == "estimateGas"){
                        console.log('Tambahin GWEI nya bang')
                        console.log(transferResult.info.error.message)
                    } else {
                        console.log('Failed transfer!')
                        console.log(transferResult.shortMessage)
                    }
            }
        })
    } catch (error) {
        console.log('ada masalah', error)
        console.log('')
    }
})();