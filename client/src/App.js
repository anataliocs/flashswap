import React, { Component } from "react";
import FlashLoaner from "./contracts/FlashLoaner.json";
import UniswapV2Factory from "./contracts/IUniswapV2Factory.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FlashLoaner.networks[networkId];
      const instance = new web3.eth.Contract(
          FlashLoaner.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runBot);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runBot = async () => {

    // Get network provider and web3 instance.
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = FlashLoaner.networks[networkId];

    const uniswapFactory = new web3.eth.Contract(
        UniswapV2Factory.abi,
        deployedNetwork && deployedNetwork.address,
    );

    const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

    await uniswapFactory.getPair(wethAddress, daiAddress);


  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
