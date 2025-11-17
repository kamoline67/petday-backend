const validarExistencia = (Model, idField = 'id', modelName = 'Recurso', source = 'params', includes = []) => {
    
    return async (req, res, next) => {
        try {
            const id = source === 'body' ? req.body[idField] : req.params[idField];

            if(isNaN(id)) {
                return res.status(400).json({ error: `ID do ${modelName.toLowerCase()} deve ser um número válido.` });
            }

            const existe = await Model.findByPk(id, { include: includes });
            
            if(!existe) {
                return res.status(404).json({ error: `${modelName} não encontrado`});
            }

            req[`${modelName.toLowerCase()}Existente`] = existe;
            next();
        
        } catch (error) {
            console.error(`Erro ao validar ${modelName.toLowerCase()}:`, error);
            return res.status(500).json({ error: `Erro interno do servidor ao validar ${modelName.toLowerCase()}`});
        }
    };
};

module.exports = validarExistencia;