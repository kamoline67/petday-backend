const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const servico = conexao.define('servico', {
    servico_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    duracao_min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    horaDisponivel: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: 'servico',
    timestamps: true
});

module.exports = servico;