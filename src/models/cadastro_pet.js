const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const pet = conexao.define('pet', {
    pet_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    especie: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    raca: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    idade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sexo: {
        type: DataTypes.ENUM('M', 'F', 'I'),
        allowNull: false
    },
    porte_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'pet',
    timestamps: true
});


module.exports = pet