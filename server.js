import request from 'request';

const URL = 'http://www.2dehands.be/gratis/';

request(url, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
});