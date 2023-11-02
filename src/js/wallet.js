const sendEthButton = document.querySelector('.sendEthButton');

let accounts = [];

async function getAccount() {
  accounts = await ethereum.request({ method: 'eth_requestAccounts' });
}

//Sending Ethereum to an address
sendEthButton.addEventListener('click', () => {
  getAccount();

  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: accounts[0],
          to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
          gasPrice: '0x4A817C800',
          gas: '0xF90A',
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
});