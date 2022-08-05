
import './App.css';
import compiledContract from "./compilerContract.json";
import {useState,useEffect} from "react"
import {ethers} from "ethers";
function App() {
  const contractAddress = "0xb1d1db1857d085d1721Eb0D16ed6c34AFeAb36E7";
  const [currentAccount,setCurrentAccount]=useState('')
  const [senderName,setSenderName]=useState("")
  const [message,setMessage]=useState("");
  const [walletConnected,setWalletConnected]=useState(false)
  const [memos,setmemos]=useState([])
  async function isWalletConnected() {
    const { ethereum } = window;
    if (!ethereum) return 0;
    const signers = await ethereum.request({ method: "eth_accounts" });//this method is used to get accounts if we conected to metamask
          console.log("Accounts: ",signers)
          if(signers.length>0){
            console.log("metamask is connected")
            setWalletConnected(1)
            return 1
          }else{
            console.log("Please connect to metamask")
          }
          return 0;
  }
  async function connectToWallet(){
    const {ethereum}=window;
    if(!ethereum){
      console.log("Please connect to wallet first");
    }else{
      const accounts=await ethereum.request({method:"eth_requestAccounts"})
      // this method is used to connect to metamask
      setCurrentAccount(accounts[0]);
      console.log("Successfully connected to wallet: ",accounts[0]);
      setWalletConnected(true)
    }
  } 
  function nameHandler(e){
    setSenderName(e.target.value);
  }
  function messageHandler(e){
    setMessage(e.target.value);
  }
  async function getMemos() {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        compiledContract.abi,
        signer
      );
      const senders = await contract.getSenders();
      setmemos(senders);
    } else {
      console.log("please connect to metamask first");
    }
  }
  async function BuyMeCoffe(){
    const {ethereum}=window;
    if(ethereum && currentAccount){
      const provider=new ethers.providers.Web3Provider(ethereum,"any")
      const signer= provider.getSigner()
      const contract=new ethers.Contract(contractAddress,compiledContract.abi,signer)
      const contractResponse=await contract.BuyMeACoffe(senderName,message,{value:ethers.utils.parseEther("0.001")});
      await contractResponse.wait();
      console.log("hash: ",contractResponse.hash)
      setMessage("")
      setSenderName("")
      getMemos();
    }else{
      console.log("Please connect to your metamask first");
    }
  }
  
  useEffect(()=>{
    getMemos();
  },[])
  return (
    <div className="App">
      <h2>Buy a coffee to Nithin :)</h2>
      {!walletConnected ? (
        <button onClick={connectToWallet}>Connect to Wallet</button>
      ) : (
        <>
          <label>Enter Your Name: </label>
          <input
            className="nameInput"
            type="text"
            placeholder="Your Name"
            value={senderName}
            onChange={nameHandler}
          />
          <br />
          <span className="messageBox">
            {" "}
            <label>Enter message: </label>
            <textarea
              placeholder="Enter message"
              value={message}
              onChange={messageHandler}
            ></textarea>
          </span>
          <br />
          <button onClick={BuyMeCoffe}>Send 0.001Eth to Nithin</button>
        </>
      )}
      {memos && <h2>My Friends who bought me Coffee!!</h2>}
      {memos &&
        memos.map((memo) => {
          return (
            <>
              <h3>{memo.name}</h3>
              <p>{memo.message}</p>
            </>
          );
        })}
    </div>
  );
}

export default App;
