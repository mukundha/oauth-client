var request = require('request')

var oauth = function(){
  /**
    { client_id: '',
      client_secret: '',
      tokenEndpoint: ''
    }
  **/
  var self = this;
  self.init = function(oauthConfig){
    self.client_id = oauthConfig.client_id
    self.client_secret = oauthConfig.client_secret
    self.token_endpoint = oauthConfig.token_endpoint
  }

  getToken = function(cb){
    var authHeader = 'Basic ' + new Buffer(self.client_id + ':' + self.client_secret).toString('base64')
    var options = {
        url:self.token_endpoint,
        method: 'POST',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Authorization' : authHeader
        },
        body: 'grant_type=client_credentials'
     }

     request(options,function(err,response,body){
       self.access_token = JSON.parse(body).access_token
       console.log('Got a new Access Token')
       cb(self.access_token)
     });
  }

  self.request = function(options,cb){
    if(!self.access_token){
        console.log('Token Not present, Get a Token First')
        getToken(function(token){
          console.log('Making API call with Token')
          makeRequest(options,cb)
        })
    }else
      makeRequest(options,cb)
  }

  makeRequest = function(options,cb,force){
    var noptions = options;
    if(!noptions.headers) noptions.headers = {}
    noptions.headers['Authorization'] = 'Bearer ' + self.access_token
    console.log(noptions);
    request(noptions,function(err,response,body){
      //See if token expired, try one more time
      if(response.statusCode==401 && !force){
          console.log('Looks like Token expired, try to get a new Token');
          getToken(function(){
            makeRequest(options,cb,true)
        })
      }else
        cb(err,response,body)
    })
  }

}

module.exports = oauth;
