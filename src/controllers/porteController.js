const { porte } = require('../models');

const porteController = {
     async listarPortes(req, res, next) {
        try{
            
            const portes = await porte.findAll({ order: [['porte_id', 'ASC']] });

            return res.status(200).json({ message: 'Portes encontrados com sucesso.', portes: portes });

        } catch (error) {
            next(error)
        }
     },

     async buscarPortePorId(req, res, next) {
        try {

            const {id} = req.params;

            const porteExistente = req.porteExistente;

            return res.status(200).json({ message: 'Porte encontrado com sucesso.', porte: porteExistente });
        
        } catch (error) {
            next(error)
        }
     }
};

module.exports = { porteController, models:{ porte }};
