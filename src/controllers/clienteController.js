const { cliente, agendamento, pet, endereco } = require('../models');

const bcrypt = require('bcrypt');
const validator = require('validator');
const dns = require('dns');

async function validarEmailcomDNS(email) {
    try {
        if (!validator.isEmail(email)) {
            return { valido: false, erro: "Formato de email inválido"};
        }
        const dominio = email.split('@')[1];
        return new Promise((resolve) => {
            dns.resolveMx(dominio, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                    resolve({
                        valido: false,
                        erro: "Domínio não possui servidor de email"
                    });
                } else {
                    resolve({
                        valido: true,
                        dominio: dominio,
                        servidores: addresses
                    });
                }
            });
        });
    } catch (erro) {
        return { valido: false, erro: erro.message };
    };
};

const clienteController = {

    async criarCliente (req, res, next) {
        try{
            const { nome, telefone, email, senha } = req.body;

                if (senha.length < 6) {
                    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres.'});
                }
        
            //Validar Email para ver se o formato e o domínio são válidos + proteger a senha

            const emailValido = await validarEmailcomDNS(email);
                if (!emailValido.valido) {
                    return res.status(400).json ({ error: emailValido.erro });
                }

            const senhaHash = await bcrypt.hash(senha, 10);

            //Criação do novo cliente.
            const novoCliente = await cliente.create({ nome, telefone, email, senha: senhaHash });

            const clienteSeguro = { 
                cliente_id: novoCliente.cliente_id,
                nome: novoCliente.nome,
                telefone: novoCliente.telefone,
                email: novoCliente.email,
                createdAt: novoCliente.createdAt,
                updatedAt: novoCliente.updatedAt
            };
            return res.status(201).json({ message: 'Usuário criado com sucesso.', cliente: clienteSeguro });
        
        } catch (error) {
            next(error);
        }
    },



    async listarClientes(req, res, next) {
        try {
            const clientes = await cliente.findAll({
                attributes: {
                    exclude: ['senha']
                },
                include: [
                    {
                        model: pet,
                        attributes: ['pet_id', 'nome', 'especie', 'raca'],
                        required: false
                    },
                    {
                        model: endereco,
                        as: 'endereco',
                        required: false
                    }
                ],
                order: [['nome', 'ASC']]
            });

            return res.status(200).json({ message: 'Clientes encontrados com sucesso.', quantidade: clientes.length, clientes: clientes });

        }catch (error) {
            next(error);
        }
    },

    async buscarClienteId(req, res, next) {
        try {
            const { id } = req.params;

            const clienteEncontrado = await cliente.findByPk(id, {
                attributes: { exclude: ['senha'] },
                include: [
                    {
                        model: pet,
                        attributes: ['pet_id', 'nome', 'especie', 'raca', 'idade', 'sexo', 'porte_id'],
                        required: false
                    },
                    {
                        model: agendamento,
                        attributes: ['agendamento_id', 'data_hora', 'status', 'endereco_atendimento'],
                        required: false,
                        order: [['data_hora', 'DESC']]
                    },
                    {
                        model: endereco,
                        as: 'endereco',
                        required: false
                    }
                ]
            });

            return res.status(200).json({ message: 'Cliente encontrado com sucesso.', cliente: clienteEncontrado });
        
        } catch (error) {
           next(error);
        }
    },

    async atualizarCliente(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, telefone, email, senha } = req.body;

            const clienteExistente = req.clienteExistente;

            const dadosAtualizacao = {};

            if (nome) dadosAtualizacao.nome = nome;
            if (telefone) dadosAtualizacao.telefone = telefone;

            if (email) {
                if (email !== clienteExistente.email) {
                    const  emailValido = await validarEmailcomDNS(email);
                    if (!emailValido.valido) {
                        return res.status(400).json({ error: emailValido.erro });
                    }
                    dadosAtualizacao.email = email;
                }
            }

            if (senha) {
                if (senha.length < 6) {
                    return res.status(400).json({ error: 'Senha deve conter pelo menos 6 caracteres.' });
                }
                dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
            }

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
            }

            await cliente.update(dadosAtualizacao, {
                where: { cliente_id: id }
            });

            const clienteAtualizado = await cliente.findByPk(id, {
                attributes: { exclude: ['senha'] },
                include: [{
                    model: endereco,
                    as:'endereco',
                    required: false
                }]
            });
            return res.status(200).json({ message: 'Cliente atualizado com sucesso.', cliente: clienteAtualizado });
        
        } catch (error) {
           next(error);
        }
    },

    async removerCliente(req, res, next) {
        try {
            const { id } = req.params;

            const clienteExistente = req.clienteExistente;

            const agendamentosDoCliente = await agendamento.count({ where: {cliente_id: id } });

            if (agendamentosDoCliente > 0) {
                return res.status(400).json({ error: 'Não é possível remover cliente com agendamentos cadastrados. Cancele os agendamentos primeiro.' });
            }

            const petsDoCliente = await pet.count({ where: {cliente_id: id} });
            if (petsDoCliente > 0) {
                return res.status(400).json({ error: 'Não é possível remover cliente com pets cadastrados. Remova pets primeiro.' });
            }

            await endereco.destroy({ where: { cliente_id: id } });
            
            await cliente.destroy({ where: { cliente_id: id } });
           
            return res.status(200).json({
                message: 'Cliente removido com sucesso',
                cliente_removido: {
                    id: clienteExistente.cliente_id,
                    nome: clienteExistente.nome,
                    email: clienteExistente.email
                }
            });

        } catch (error) {
            next(error);
        }
    },
};

module.exports = { clienteController,  models: { cliente, pet, agendamento } };
