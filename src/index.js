// Importa os módulos necessários para criar o servidor e manipular URLs.
const http = require('http');
const { URL } = require('url');

// Importa as rotas definidas em outro arquivo.
const routes = require('./routes');

// Importa uma função auxiliar para analisar o corpo das requisições.
const bodyParser = require('./helpers/bodyParser');

// Cria um servidor HTTP.
const server = http.createServer((request, response) => {
    // Analisa a URL da requisição para obter o caminho (pathname).
    const parsedUrl = new URL(request.url, 'http://localhost:3000');
    let { pathname } = parsedUrl;
    let id = null;

    // Divide o caminho da URL para identificar parâmetros, como IDs.
    const splitEndPoint = pathname.split('/').filter(Boolean);

    // Verifica se existe um ID na URL e ajusta o caminho.
    if (splitEndPoint.length > 1) {
        id = splitEndPoint[1];
        pathname = `/${splitEndPoint[0]}/:id`;
    }

    // Busca a rota correspondente no array de rotas.
    const route = routes.find((routeObj) => {
        // Trata rotas que contêm um ID.
        if (routeObj.endpoint.includes(':id') && splitEndPoint.length > 1) {
            return routeObj.endpoint === pathname && routeObj.method === request.method;
        // Trata rotas sem ID.
        } else if (!routeObj.endpoint.includes(':id') && splitEndPoint.length === 1) {
            return routeObj.endpoint === `/${splitEndPoint[0]}` && routeObj.method === request.method;
        }
    });

    // Se a rota existir, processa a requisição.
    if (route) {
        // Adiciona parâmetros de query e parâmetros de rota ao objeto request.
        request.query = Object.fromEntries(parsedUrl.searchParams);
        request.params = { id };

        // Método para facilitar o envio de respostas.
        response.send = (statusCode, body) => {
            response.writeHead(statusCode, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(body));
        };

        // Trata requisições POST, PUT e PATCH usando o bodyParser.
        if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            bodyParser(request, () => route.handler(request, response));
        } else {
            // Para outros métodos, apenas chama o manipulador da rota.
            route.handler(request, response);
        }
        
    } else {
        // Se a rota não existir, envia uma resposta 404.
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
       
    }
});

// Inicia o servidor na porta 3000.
server.listen(3000, () => console.log('Server started at http://localhost:3000'));
