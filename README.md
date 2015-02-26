# oauth http client

This is a simple oauth wrapper to 'request' module to handle oauth token expirations

# usage
```
var oauth = require('./oauth')
var client = new oauth()
client.init({
  client_id: '',
  client_secret: '',
  token_endpoint: 'http://oauth-provider/oauth/token'
})
client.request({url: 'http://your-api/resource1',
    function(err,response,body){
      res.send(body)
})
```
# support

Currently, it supports the following grant_type

1. client_credentials

# to-do

Add support for other grant types and refresh tokens
