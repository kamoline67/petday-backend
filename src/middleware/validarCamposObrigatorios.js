const validarCamposObrigatorios = (camposObrigatorios) => {
    return (req, res, next) => {
        try {
            const camposFalta = [];

            for (const campo of camposObrigatorios) {
                if (!req.body[campo] || req.body[campo].toString().trim() === '') {
                    camposFalta.push(campo);
                }
            }
            
            if (camposFalta.length > 0) {
                return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.', camposFalta: camposFalta, message: `Os seguintes campos são obrigatórios: ${camposFalta.join(',')}` });
            }

            next();
        
        } catch (error) {
            console.error('Erro ao validar campos obrigatórios:', error);
            return res.status(500).json({ error: 'Erro interno na validação de campos.'});
        }
    };
};

module.exports = validarCamposObrigatorios;