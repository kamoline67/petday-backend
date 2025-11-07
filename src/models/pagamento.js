const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const pagamento = conexao.define('pagamento', {
    pagamento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    agendamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    forma_pagamento: {
        type: DataTypes.ENUM('Dinheiro', 'Cartão', 'Pix', 'Boleto'),
        allowNull: false
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pendente', 'Pago'),
        allowNull: false
    }
}, {
    tableName: 'pagamento',
    timestamps: true
});


module.exports = pagamento