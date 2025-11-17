const { porte_servico, porte, servico } = require('../models');

const porteServicoController = {

    async atualizarPreco(req, res, next) {
        try {

            const { servico_id, porte_id } = req.params;
            const { preco_porte } = req.body;

            const [porteServico, created] = await porte_servico.findOrCreate({
                where: { servico_id, porte_id },
                defaults: { preco_porte }
            });

            if (!created) {
                await porte_servico.update({ preco_porte }, {
                    where: { servico_id, porte_id }
                });
            }

            const precoAtualizado = await porte_servico.findOne({
                where: { servico_id, porte_id },
                include: [
                    { model: porte },
                    { model: servico }
                ]
            });

            return res.status(200).json({ message: 'Preco atualizado com sucesso.', porte_servico: precoAtualizado });

        } catch (error) {
            next(error);
        }
    },

    async listarPrecoPorServico(req, res, next) {
        try{
            const { servico_id } = req.params;

            const precos = await porte_servico.findAll({
                where: { servico_id },
                include: [
                    { model: porte }
                ]
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = { porteServicoController, models: {porte_servico, porte, servico }};