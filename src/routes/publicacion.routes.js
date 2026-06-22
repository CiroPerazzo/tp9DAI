const express = require('express');
const publicacionController = require('../controllers/publicacion.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createPublicacionSchema } = require('../middlewares/schemas');

const router = express.Router();

router.get('/', publicacionController.getAll);
router.post('/', authMiddleware, validate(createPublicacionSchema), publicacionController.create);

module.exports = router;
