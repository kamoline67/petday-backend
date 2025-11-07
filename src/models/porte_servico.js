const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const porte_servico = conexao.define('porte_servico', {
    porte_servico_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    servico_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    preco_porte: {
        type: DataTypes.DECIMAL(10, 2),
    }, 
}, {
    tableName: 'porte_servico',
    timestamps: false
});


module.exports = porte_servico;