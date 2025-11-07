const conexao = require('../config/database');

const empresa = require('./cadastro_empresas');
const cliente = require('./cadastro_clientes');
const pet = require('./cadastro_pet');
const porte = require('./porte');
const agendamento = require('./agendamento');
const agendamento_servico = require('./agendamento_servico');
const porte_servico = require('./porte_servico');
const servico = require('./servico');
const pagamento = require('./pagamento');
const endereco = require('./endereco');

// Cliente (1) - (N) Pet
cliente.hasMany(pet, {
    foreignKey: 'cliente_id'
});
pet.belongsTo(cliente, {
    foreignKey: 'cliente_id'
});

// Cliente (1) - (1) Endereco
cliente.hasOne(endereco, {
    foreignKey: 'entidade_id',
    constraints: false,
    scope: {tipo_entidade: 'cliente'},
    as: 'endereco'
});

endereco.belongsTo(cliente, {
    foreignKey: 'entidade_id',
    constraints: false,
    as: 'cliente'
});

//Empresa (1) - (1) Endereco
empresa.hasOne(endereco, {
    foreignKey: 'entidade_id',
    constraints: false,
    scope: {tipo_entidade: 'empresa'},
    as: 'endereco'
});

endereco.belongsTo(empresa, {
    foreignKey: 'entidade_id',
    constraints: false,
    as: 'empresa'
})

// Porte (1) - (N) Pet
porte.hasMany(pet, {
    foreignKey: 'porte_id'
});
pet.belongsTo(porte, {
    foreignKey: 'porte_id'
});

// Cliente (1) - (N) Agendamento
cliente.hasMany(agendamento, {
    foreignKey: 'cliente_id'
});
agendamento.belongsTo(cliente, {
    foreignKey: 'cliente_id'
});

// Porte (1) - (N) Porte_servico
porte.hasMany(porte_servico, {
    foreignKey: 'porte_id'
});
porte_servico.belongsTo(porte, {
    foreignKey: 'porte_id'
});

// Servico (1) - (N) Porte_servico
servico.hasMany(porte_servico, {
    foreignKey: 'servico_id'
});
porte_servico.belongsTo(servico, {
    foreignKey: 'servico_id'
});

// Agendamento (1) - (N) Agendamento_servico
agendamento.hasMany(agendamento_servico, {
    foreignKey: 'agendamento_id'
});
agendamento_servico.belongsTo(agendamento, {
    foreignKey: 'agendamento_id'
});

// Servico (1) - (N) Agendamento_servico
servico.hasMany(agendamento_servico, {
    foreignKey: 'servico_id'
});
agendamento_servico.belongsTo(servico, {
    foreignKey: 'servico_id'
});

// Pet (1) - (N) Agendamento
pet.hasMany(agendamento, {
    foreignKey: 'pet_id'
});
agendamento.belongsTo(pet, {
    foreignKey: 'pet_id'
});

// Empresa (1) - (N) Servico
empresa.hasMany(servico, {
    foreignKey: 'empresa_id'
});
servico.belongsTo(empresa, {
    foreignKey: 'empresa_id'
});

// Agendamento (1) - (1) Pagamento
agendamento.hasOne(pagamento, {
    foreignKey: 'agendamento_id'
});
pagamento.belongsTo(agendamento, {
    foreignKey: 'agendamento_id'
});

// Porte (N) - (N) Servico
porte.belongsToMany(servico, {
    through: porte_servico,
    foreignKey: 'porte_id',
    otherKey: 'servico_id',
    as: 'servicos'
});
servico.belongsToMany(porte, {
    through: porte_servico,
    foreignKey: 'servico_id',
    otherKey: 'porte_id',
    as: 'portes'
});

// Cliente (1) - (N) Pagamento
cliente.hasMany(pagamento, {
    foreignKey: 'cliente_id'
});
pagamento.belongsTo(cliente, {
    foreignKey: 'cliente_id' 
});

// Porte (1) - (N) agendamento_servico
porte.hasMany(agendamento_servico, {
    foreignKey: 'porte_id' 
});
agendamento_servico.belongsTo(porte, {
    foreignKey: 'porte_id' 
});

// Agendamento (N) - (N) Servico
agendamento.belongsToMany(servico, {
    through: agendamento_servico,
    foreignKey: 'agendamento_id',
    otherKey: 'servico_id',
    as: 'servicos'
});
servico.belongsToMany(agendamento, {
    through: agendamento_servico,
    foreignKey: 'servico_id',
    otherKey: 'agendamento_id',
    as: 'agendamentos'
});

const syncDatabase = async () => {
    try {
        await conexao.sync({ force: false});
        console.log('Todas as tabelas foram sincronizadas.');
    } catch (error) {
        console.error('Erro ao sincronizar tabelas.', error);
    }
};

syncDatabase();

module.exports = {
    empresa,
    cliente,
    pet,
    porte,
    agendamento,
    agendamento_servico,
    porte_servico,
    servico,
    pagamento,
    endereco,
    conexao
};