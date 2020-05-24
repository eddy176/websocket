const WebSocket = require('ws');
const express = require('express');
const API_KEY = 'RW2GVN4XSIQVGV5F2SUM';


// express server code
var app = express();
app.set('port', (process.env.PORT || 8080));

//middleware
app.use(express.static('public'));

var server = app.listen(app.get('port'), function ( ) {
    console.log("server listening . . . ");
});

const wss = new WebSocket.Server({ server: server });

//WEBSOCKET server code


//link
wss.on('connection', function (wsclient) {
    
  //server received incoming message
  wsclient.on('message', function (message) {
      //print received message
      const ws = new WebSocket('wss://stream.cryptowat.ch/connect?apikey='+API_KEY);
      ws.on('message', function (msg) {
        console.log("D: ",JSON.parse(msg.toString()));
        const d = JSON.parse(msg.toString());
        
        console.log("D: ",d);
        // The server will always send an AUTHENTICATED signal when you establish a valid connection
        // At this point you can subscribe to resources
        if (d.authenticationResult && d.authenticationResult.status === 'AUTHENTICATED') {
          if (message == "btc") {
            console.log("HITTING");
        
            //unsubscribeFrom(ws, ['assets:77:trades']);
            subscribeTo(ws, ['assets:60:trades']);
            
          } else if (message == "eth") {
            subscribeTo(ws, ['assets:77:trades']);
            //unsubscribeFrom(ws, ['assets:60:trades']);
          }  else if (message == "xrp") {
            subscribeTo(ws, ['assets:110:trades']);
            //unsubscribeFrom(ws, ['assets:60:trades']);      
          } else if (message == "usdt") {
            subscribeTo(ws, ['assets:2:trades']);
            //unsubscribeFrom(ws, ['assets:60:trades']);      
          } else if (message == "bch") {
            subscribeTo(ws, ['assets:22:trades']);
            //unsubscribeFrom(ws, ['assets:60:trades']);      
          }
                    
        }

        // Market data comes in a marketUpdate
        // In this case, we're expecting trades so we look for marketUpdate.tradesUpdate
        if (d.marketUpdate && d.marketUpdate.tradesUpdate) {
          for (let trade of d.marketUpdate.tradesUpdate.trades) {
            if (d.marketUpdate.market.marketId == '61239') {
              wsclient.send(`BTC/USD trade on market  ${trade.priceStr} `);
            } else if (d.marketUpdate.market.marketId == '62428') {
              wsclient.send(`ETH/USD trade on market  ${trade.priceStr} `);
            } else if (d.marketUpdate.market.marketId == '11525') {
              wsclient.send(`XRP/USD trade on market  ${trade.priceStr} `);
            } else if (d.marketUpdate.market.marketId == '144') {
              wsclient.send(`USDT/USD trade on market  ${trade.priceStr} `);
            } else if (d.marketUpdate.market.marketId == '4732') {
              wsclient.send(`BCH/USD trade on market  ${trade.priceStr} `);
            }
          }
        }
      });
      console.log('received: %s', message);
      //send message back to client
      wsclient.send('got it thanks bro!')
  });
  //send message to client
  wsclient.send('Server here sup');

})

// Helper method for subscribing to resources
function subscribeTo(ws, resources) {
  ws.send(JSON.stringify({
    subscribe: {
      subscriptions: resources.map((resource) => { 
        return {
            streamSubscription: {
                resource: resource
            } 
        }})
    }
  }));
}
// Helper method for unsubscribing to resources
/*function unsubscribeFrom(ws, resources) {
  ws.send(JSON.stringify({
    unsubscribe: {
      subscriptions:  { 
       
            streamSubscription: {
                resource: resources
            } 
        }
    }
  }));
}*/
