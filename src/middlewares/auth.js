const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports = (role) => async (req, res, next) => {
  
    try {
        
        const token = req.header('authorization').replace('Bearer ', '');
        const verificar = jwt.verify(token, process.env.JWT_SECRET);
        const userLogin = await userModel.findOne({ _id: verificar.user.id, token: token });
        
        if (!userLogin) {
            return res.status(401).json({ msg: 'Logueado: Acceso Restringido' })
        }
        if (typeof role === 'string' && verificar.user.role !== role) {
            return res.status(401).json({ msg: 'Logueado: Acceso Restringido' })

        } else if (Array.isArray(role) && !role.includes(verificar.user.role)) {
            return res.status(401).json({ msg: 'Logueado: Acceso Restringido' })
        }

        res.locals.user = userLogin;
        res.locals.token = token;
       
        next();
    }

    catch (error) {
        return res.status(401).json({ msg: 'Deslogueado: No Autorizado', error: error.message })
    }
}
