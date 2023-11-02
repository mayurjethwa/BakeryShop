App = {
  web3Provider: null,
  contracts: {},
  walletBalance: 0,

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-price').text(data[i].price);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-installment').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
  web3 = new Web3(App.web3Provider);

  return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
    
      App.initBalance();
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  initBalance: function(){
    
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var balance = await web3.eth.getBalance(account); //Will give value in.
      App.walletBalance = balance;
      var total_balance = $('#total_balance');
      console.log(App.walletBalance);
      total_balance.text(web3.utils.fromWei(balance, 'ether')+" ETH");
      console.log(balance);
      // console.log(web3.utils.fromWei(balance, 'ether'))
    })
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click', '.btn-installment', App.handleInstallment);
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        App.initBalance();
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleInstallment: function(event) {
    const sendEthButton = document.querySelector('.btn-installment');

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
    return App.markAdopted();
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

const sendEthButton = document.querySelector('.btn-installment');

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