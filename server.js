import htmlparser from 'htmlparser2';
import request from 'request';
import http from 'http';
import fs from 'fs';

const URL = 'http://www.2dehands.be/gratis/';

http.get(URL, response => parseResponse(response));

const parseResponse = function(response) {
  let data = '';
  response.on('data', chunk => data += chunk);
  const articles = [];
  let article = null;
  let property = null;
  response.on('end', chunk => {
    const parsedData = new htmlparser.Parser({
      onopentag(name, attrs) {
        switch(name) {
          case 'article':
            article = { id: attrs.id };
            break;
          case 'h3':
            if (attrs.itemprop === 'name') property = 'name';
            break;
          case 'a':
            if (attrs.class === 'listed-adv-item-link') article.href = attrs.href;
            break;
          default:
            break;
        }
      },
      ontext(text) {
        switch(property) {
          case 'name':
            article.name = text;
            property = null;
            break;
          default:
            break;
        }
      },
      onclosetag(name) {
        switch(name) {
          case 'article':
            articles.push(article);
            article = null;
            break;
          default:
            break;
        }
      },
      onend() {
        console.log(articles);
      }
    }, { decodeEntities: true });
    parsedData.write(data);
    parsedData.end();
  });
};
