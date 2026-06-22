const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const publicacionRoutes = require('./publicacion.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/publicaciones', publicacionRoutes);

module.exports = router;
