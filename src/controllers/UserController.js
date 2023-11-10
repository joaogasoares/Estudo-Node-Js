// Importa a lista de usuários mockados (fictícios).
let users = require('../mocks/users');

module.exports = {
    // Lista todos os usuários, com a opção de ordenar ascendentemente ou descendentemente.
    listUser(request, response) {
        // Determina a ordem de classificação com base na query da requisição.
        const order = request.query && request.query.order ? request.query.order : 'asc';

        // Classifica os usuários com base no ID, em ordem ascendente ou descendente.
        const sortedUsers = [...users].sort((a, b) => {
            if (order === 'desc') {
                return a.id < b.id ? 1 : -1;
            }
            return a.id > b.id ? 1 : -1;
        });

        // Envia a lista classificada de usuários.
        response.send(200, sortedUsers);
    },

    // Recupera um usuário pelo seu ID.
    getUserById(request, response) {
        const { id } = request.params;
        const user = users.find((u) => u.id === Number(id));

        // Se o usuário existir, envia os dados do usuário; caso contrário, envia um erro 404.
        if (user) {
            response.send(200, user);
        } else {
            response.send(404, {error: 'User not found'});
        }
    },
    
    // Cria um novo usuário.
    createUser(request, response) {
        const { body } = request;
    
        // Determina o ID para o novo usuário.
        const lastUser = users[users.length - 1];
        const lastUserId = lastUser ? lastUser.id : 0;
        const newUser = {
            id: lastUserId + 1,
            name: body.name,
        };
    
        // Adiciona o novo usuário à lista.
        users.push(newUser);

        // Envia os dados do novo usuário.
        response.send(200, newUser);
    },
    
    // Atualiza um usuário existente.
    updateUser(request, response) {
        let { id } = request.params;
        const { name } = request.body;

        id = Number(id);

        // Verifica se o usuário existe.
        const userExists = users.find((user) => user.id == id);

        if (!userExists) {
            return response.send(400, {error: 'User not found' });
        }

        // Atualiza os dados do usuário.
        users = users.map((user) => {
            if (user.id == id) {
                return {
                    ...user,
                    name,
                };
            }

            return user;
        });

        // Envia os dados atualizados do usuário.
        response.send(200, { id, name });
    },

    // Deleta um usuário pelo ID.
    deleteUser(request, response) {
        let { id } = request.params;
        id = Number(id);

        // Remove o usuário da lista.
        users = users.filter((user) => user.id !== id);

        // Confirma a remoção do usuário.
        response.send(200, { deleted: true });
    }
    
};
