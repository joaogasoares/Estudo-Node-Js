// Importa o módulo de requisição HTTP.
const { request } = require("http");

// Função bodyParser para analisar o corpo da requisição.
function bodyParser(request, callback) {
    // Inicializa uma string para armazenar o corpo da requisição.
    let body = '';

    // Evento 'data' é acionado quando um pedaço de dados é recebido.
    request.on('data', chunk => {
        // Concatena cada pedaço de dados recebido à variável 'body'.
        body += chunk.toString();
    });

    // Evento 'end' é acionado quando todos os dados foram recebidos.
    request.on('end', () => {
        try {
            // Tenta analisar o corpo da requisição como JSON.
            if (body) {
                request.body = JSON.parse(body);
            } else {
                // Se o corpo estiver vazio, atribui um objeto vazio ao body da requisição.
                request.body = {};
            }
            // Chama a função de callback após o processamento bem-sucedido.
            callback();
        } catch (error) {
            // Se ocorrer um erro na análise do JSON, imprime o erro no console.
            console.error('Error parsing JSON:', error);
        }
    });
}

// Exporta a função bodyParser para ser usada em outros arquivos.
module.exports = bodyParser;
