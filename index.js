var connectSdk = require('connect-sdk-nodejs');
var http = require('http');
var express = require('express');
var app = express();

// Initiate Connection to Platform
connectSdk.init({
  host: 'eu.sandbox.api-ingenico.com',
  scheme: 'https',
  port: 443,
  enableLogging: true,
  apiKeyId: YOURE_UNIQUE_API_KEY,
  secretApiKey: YOURE_UNIQUE_SECRET_API_KEY
});

// Test Connection
app.get('/testing', function (req, res) {
  connectSdk.services.testconnection(2610, null, function (err, sdkResponse) {
    res.send(sdkResponse)
  });
});

// Make a Payment
app.get('/payments/create', function (req, res) {
  var body = {
    'order' : {
      'amountOfMoney' : {
        'currencyCode' : 'USD',
        'amount' : 1
      },
      'customer' : {
        'locale' : 'en_US',
        'billingAddress' : {
          'countryCode' : 'US'
        }
      },
      'references' : {
          'merchantReference' : 'TestOrder',
        }
    },
    'cardPaymentMethodSpecificInput' : {
        'paymentProductId' : 1,
        'skipAuthentication' : false,
        'card' : {
          'cvv' : '123',
          'cardNumber' : '4567350000427977',
          'expiryDate' : '1220',
          'cardholderName' : 'Wile E. Coyote'
        }
      }
  }
  connectSdk.payments.create(2610, body, null, function (err, sdkResponse) {
    console.log(sdkResponse)
    res.send(sdkResponse)
  });
});

// Approve Payment
app.get('/payments/approve/:paymentId', function (req, res) {
  var id = req.params.paymentId
  var body = {
    'order' : {
        'references' : {
            'merchantReference' : 'TestOrder'
        }
    }
  }
  connectSdk.payments.approve(2610, id, body, null, function(err, sdkResponse){
    res.send(sdkResponse)
  });
});

// List Payments
app.get('/payments/find', function (req, res) {
  var query = {
      'merchantReference' : 'TestOrder',
      'offset' : 0,
      'limit' : 10,
  };
  connectSdk.payments.find(2610, query, function (err, sdkResponse) {
    res.send(sdkResponse)
  });
});

// Request a Refund
app.get('/payments/refund/:paymentId', function (req, res) {
  var id = req.params.paymentId;
  var body = {
    'refundReferences' : {
        'merchantReference' : 'TestRefund'
    },
    'amountOfMoney' : {
        'currencyCode' : 'USD',
        'amount' : 1
    },
  };
  connectSdk.payments.refund(2610, id, body, null, function(err, sdkResponse) {
    res.send(sdkResponse)
  });
})

// List Refunds
app.get('/refunds/find', function (req, res) {
  var query = {
      'merchantReference' : 'TestRefund',
      'offset' : 0,
      'limit' : 10,
  };
  connectSdk.refunds.find(2610, query, function (err, sdkResponse) {
    res.send(sdkResponse)
  });
});

app.use(express.static(__dirname));
app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('server running at http://localhost:' + 3000);
});
