import { ethers } from "./etherV6.js";
import { abi, contractAddress } from "./constant.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
const withdrawButton = document.getElementById("withdrawButton");
withdrawButton.onclick = withdraw;
// connect function of metamask to our browser
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
    await ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Install the Metamask in your browser";
  }
}
// fund function
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log("funding with:", ethAmount);
  if (typeof window.ethereum !== "undefined") {
    // provider
    // siger/wallet
    // contract api and its address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transactionResponse = await contract.fund({
      value: ethers.utils.parseEther(ethAmount),
    });
  }
}
// withdrow function
async function withdraw() {
  console.log(`Withdrawing...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
      // await transactionResponse.wait(1)
    } catch (error) {
      console.log(error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}
function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
