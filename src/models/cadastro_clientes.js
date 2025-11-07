const { DataTypes } = require('sequelize');
const conexao = require('../config/database');

const cliente = conexao.define('cliente', {
    cliente_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING(),
        allowNull: false,
        validate: {
            len: [6, 20]
        }
    }
}, {
    tableName: 'cliente',
    timestamps: true
});


module.exports = cliente