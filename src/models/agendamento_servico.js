const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const agendamento_servico = conexao.define('agendamento_servico', {
    agendamento_servico_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    agendamento_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    servico_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    porte_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },  
    preco_unitario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    observacao: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'agendamento_servico',
    timestamps: true
});



module.exports = agendamento_servico;