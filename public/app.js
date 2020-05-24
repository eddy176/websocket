
/*var getStock = function (symbol) {
    return fetch("https://alpha-vantage.p.rapidapi.com/query?symbol="+symbol+"&function=GLOBAL_QUOTE", {
        method: "GET",
        headers: {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key": "addmykey!"
        }
    }).then( response => {
        console.log(response);
    }).catch( err => {
        console.log(err);
    })
};*/


var app = new Vue({
    el: '#app',
    data: {
        socket: null,
        messageToSend: "",
        btcincomingMessages: "",
        ethincomingMessages: "",
        xrpincomingMessages: "",
        usdtincomingMessages: "",
        bchincomingMessages: "",


    },
    methods: {
        sendMessage: function () {
            console.log("MESSAGE TO SEND:", this.messageToSend);
            this.socket.send(this.messageToSend);
            this.messageToSend = "";
        },
        connectSocket: function () {
            this.socket = new WebSocket("ws://vast-stream-27107.herokuapp.com");
            //this.socket = new WebSocket("ws://localhost:8080");
            this.socket.onmessage = (event) => {
                //client received incoming message
                console.log('received: ', event.data);
                console.log('EVENT: ', event);
                if (event.data.includes("BTC")) {
                    this.btcincomingMessages = event.data;
                } else if (event.data.includes("ETH")) {
                    this.ethincomingMessages = event.data;
                } else if (event.data.includes("XRP")) {
                    this.xrpincomingMessages = event.data;
                } else if (event.data.includes("USDT")) {
                    this.usdtincomingMessages = event.data;
                } else if (event.data.includes("BCH")) {
                    this.bchincomingMessages = event.data;
                } 
                
            };

            //wait for connection to server to be made
            //send message to server
            this.socket.onopen = () => {
                //this.socket.send("Client here sup");
                
            }
        }
        
    },
    created: function () {
        console.log("sup");
        this.connectSocket();
    }
});