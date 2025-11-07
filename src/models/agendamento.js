const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const agendamento = conexao.define('agendamento', {
    agendamento_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pet_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_hora: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    endereco_atendimento: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    transporte: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Agendado', 'Finalizado', 'Cancelado'),
        defaultValue: 'Agendado'
    }
}, {
    tableName: 'agendamento',
    timestamps: true
});


module.exports = agendamento