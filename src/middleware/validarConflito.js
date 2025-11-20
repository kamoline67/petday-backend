const { Op } = require('sequelize');

const validarConflitoAgendamento = async (empresa_id, data_hora, agendamento_id = null) => {
    const { agendamento } = require('../models');

    const where = {
        empresa_id,
        data_hora: {
            [Op.between]: [
                new Date(data_hora.getTime() - 30 * 60000),
                new Date(data_hora.getTime() + 30 * 60000)
            ]
        },
        status: { [Op.in]: ['Agendado', 'Confirmado', 'Em Andamento'] }
    };

    if (agendamento_id) {
        where.agendamento_id = { [Op.ne]: agendamento_id };
    }

    const conflito = await agendamento.findOne({ where });

    return conflito;
};

module.exports = validarConflitoAgendamento;