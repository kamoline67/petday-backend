const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const endereco = conexao.define('endereco', {
    endereco_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    tipo_entidade: {
        type: DataTypes.ENUM('cliente', 'empresa'),
        allowNull: false
    },
    entidade_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cidade: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    rua: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    complemento: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    estado: {
        type: DataTypes.STRING(200),
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false
    }
}, {
     tableName: 'endereco',
        timestamps: false,
        indexes: [{ unique: true, fields: ['tipo_entidade', 'entidade_id'] }]
});

module.exports = endereco;