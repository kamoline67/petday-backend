const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const porte = conexao.define('porte', {
    porte_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    descricao: {
        type: DataTypes.ENUM('Pequeno', 'Médio', 'Grande'),
        allowNull: false,
    },
}, {
    tableName: 'porte',
    timestamps: false
});


module.exports = porte;