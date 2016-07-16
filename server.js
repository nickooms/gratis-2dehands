import request from 'request';
// import textract from 'textract';
import fs from 'fs';

const URL = 'http://www.2dehands.be/gratis/';
/* const START = '<article';
const END = '</article>';
const ATTRS = {
  ' itemscope itemtype="http://schema.org/Product"': '',
  '<div class="listed-item listed-adv-item ">': '',
  '<a class="listed-adv-item-link"': '\n\t<a',
  '<div class="listed-item-imagery">': '',
  '<div class="listed-item-photo">': '',
  '<img itemprop="image"': '\n\t<img',
  '<span class="icon-clock-small"></span>': '',
  '<span class="icon-location"></span>': '',
  '<div class="listed-item-details">': '',
  '<div class="listed-item-description">': '',
  '<h3 itemprop="name">': '\n\t<name>',
  '<p class="description" itemprop="description">': '\n\t<description>',
  '<div itemprop="offers" itemscope itemtype="http://schema.org/Offer" class="listed-item-price">': '<offers>',
  '<div itemprop="price">': '\n\t<price>',
  '<div class="listed-item-location">': '<location>',
  '<time class="listed-item-date"': '\n\t<time',
  ' class="listed-item-place"': '',
  '</div>': '',
  '<offers>': '',
  '<location>': '',
  '</a>': '',
  '</h3>': '',
  '</address>': '',
  '</time>': '',
  '</p>': '',
};
const replaceAttrs = x => {
  let article = x;
  Object.keys(ATTRS).forEach(attr => {
    article = article.split(attr).join(ATTRS[attr]);
  });
  return article;
};*/

var http = require('http');
var htmlparser = require('htmlparser2');

var url = URL;// 'http://www.codingdefined.com'

http.get(url, function(response) {
  parseResponse(response);
});

var parseResponse = function(response) {
  var data = '';
  response.on('data', function(chunk) {
    data += chunk;
  });
  var tags = [];
  var tagsCount = {};
  var tagsWithCount = [];
  response.on('end', function(chunk) {
    var parsedData = new htmlparser.Parser({
      onopentag: function(name, attribs) {
        if (tags.indexOf(name) === -1) {
          tags.push(name);
          tagsCount[name] = 1;
        } else {
          tagsCount[name]++;
        }
      },
      onend: function() {
        for (var i = 1; i < tags.length; i++) {
          tagsWithCount.push({ name: tags[i], count: tagsCount[tags[i]] });
        }
      }
    }, { decodeEntities: true });
    parsedData.write(data);
    parsedData.end();
    console.log(tagsWithCount);
  });
};

/* request(URL, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    // const start = body.indexOf(START);
    // const end = body.lastIndexOf(END) + END.length;
    const articles = body
      .substring(start, end);
      .replace(/>\s+</g, '><')
      .split(END + START)
      .map(replaceAttrs);
    //console.log(articles.length);
    fs.writeFileSync('test.html', body);// articles.join(`${END}\n${START}`));
    // console.log(body);
  }
});*/

/*textract.fromUrl(URL, { preserveLineBreaks: true }, function(error, text) {
  if (error) console.log(error);
  console.log(text);
});*/
