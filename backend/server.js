const http = require('http');
const { createPerson, getAllPersons, getPersonById, updatePerson, deletePerson } = require('./personController');

const PORT = 3001;

const parseBody = (req) => new Promise((resolve) => {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => resolve(JSON.parse(body)));
});

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url === '/persons' && method === 'GET') {
    const persons = await getAllPersons();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(persons));
  }

  else if (url === '/persons' && method === 'POST') {
    const body = await parseBody(req);
    const result = await createPerson(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  }

  else if (url.match(/^\/persons\/[a-f0-9]{24}$/) && method === 'GET') {
    const id = url.split('/')[2];
    const person = await getPersonById(id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(person));
  }

  else if (url.match(/^\/persons\/[a-f0-9]{24}$/) && method === 'PUT') {
    const id = url.split('/')[2];
    const body = await parseBody(req);
    const result = await updatePerson(id, body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  }

  else if (url.match(/^\/persons\/[a-f0-9]{24}$/) && method === 'DELETE') {
    const id = url.split('/')[2];
    const result = await deletePerson(id);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  }

  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
