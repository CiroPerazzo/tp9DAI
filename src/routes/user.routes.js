const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { updatePerfilSchema } = require('../middlewares/schemas');

const router = express.Router();

router.get('/perfil', authMiddleware, userController.getPerfil);
router.put('/perfil', authMiddleware, validate(updatePerfilSchema), userController.updatePerfil);

module.exports = router;
