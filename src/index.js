const { ethers } = require("ethers");
const StarNotary = require("/build/contracts/StarNotary.json");

const enableMetaMaskBtn = document.getElementById("metaMask");
const createStarBtn = document.getElementById("createStar");
const searchStarBtn = document.getElementById("searchStar");

let provider;
let user;
let signer;
let contract;

async function enableMetaMask() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    user = await provider.send('eth_requestAccounts', []);
    if (ethereum.isConnected) {
        try {
            signer = await provider.getSigner();
            contract = new ethers.Contract(
                StarNotary.networks['4'].address,
                StarNotary.abi,
                signer
            );
        }
        catch (e) {
            console.log(e)
        }
    }
}
async function createStar() {
    try {
        const starName = document.getElementById("starName").value;
        await contract.createStar(starName);
        setStatus(starName);
    }
    catch (e) {
        console.log(e)
    }
}
function setStatus(name) {
    let span = document.getElementById("starCreatedStatus");
    span.innerText = `The star ${name} was created.`
}
async function searchStar() {
    let _id = document.getElementById("starId").value;
    let name = document.getElementById("searchStarName");
    let searched = await contract.lookUptokenIdToStarInfo(_id);
    console.log(_id);
    console.log(searched);
    name.innerText = searched;
}

enableMetaMaskBtn.addEventListener('click', enableMetaMask);
createStarBtn.addEventListener('click', createStar)
searchStarBtn.addEventListener('click', searchStar);