import htmlparser from 'htmlparser2';
import request from 'request';
import http from 'http';
import fs from 'fs';

const URL = 'http://www.2dehands.be/gratis/';

http.get(URL, response => parseResponse(response));

const i = x => '  '.repeat(x);

const ul = (children, indent = 0) => {
  const I = i(indent);
  return `${I}<ul>
${children}
${I}</ul>`;
};

const li = (x, indent) => {
  const I = i(indent);
  return `${I}<li style="height: 120px;">
${I}  <img src="${(x.image && x.image.replace(/^\/\//, 'http://') || '')}" style="margin: 0px 10px; width: 100px; height: 100px; float: left; clear:left;" />
${I}  <h2>${x.name}</h2>
${I}  <div>${x.description}</div>
${I}</li>`;
};

const parseResponse = function(response) {
  let data = '';
  response.on('data', chunk => data += chunk);
  const articles = [];
  let article = null;
  let property = null;

  const onopentag = (name, attrs) => {
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
      case 'img':
        if (attrs.itemprop === 'image') article.image = attrs.src;
        break;
      case 'p':
        if (attrs.class === 'description' && attrs.itemprop === 'description') property = 'description';
        break;
      default:
        break;
    }
  };

  const ontext = text => {
    switch(property) {
      case 'name':
        article.name = text;
        property = null;
        break;
      case 'description':
        article.description = text;
        property = null;
        break;
      default:
        break;
    }
  };

  const onclosetag = name => {
    switch(name) {
      case 'article':
        articles.push(article);
        article = null;
        break;
      default:
        break;
    }
  };

  const onend = () => {
    const page = ul(articles.map(x => li(x, 1)).join('\n'), 0);
    fs.writeFile('output.json', JSON.stringify(articles, null, 2));
    fs.writeFile('output.html', page);
    console.log(`Found ${articles.length} items`);
  };

  response.on('end', chunk => {
    const parsedData = new htmlparser.Parser({ onopentag, onclosetag, ontext, onend }, { decodeEntities: true });
    parsedData.write(data);
    parsedData.end();
  });
};
