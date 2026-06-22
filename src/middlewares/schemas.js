const Joi = require('joi');

const registerSchema = Joi.object({
  nombre_usuario: Joi.string().min(3).max(50).required(),
  nombre_completo: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(100).required(),
  foto_perfil: Joi.string().uri().max(255).optional().allow(''),
  biografia: Joi.string().max(500).optional().allow(''),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createPublicacionSchema = Joi.object({
  url_imagen: Joi.string().uri().max(255).required(),
  descripcion: Joi.string().max(1000).optional().allow(''),
});

const updatePerfilSchema = Joi.object({
  nombre_completo: Joi.string().min(2).max(100).optional(),
  foto_perfil: Joi.string().uri().max(255).optional().allow(''),
  biografia: Joi.string().max(500).optional().allow(''),
}).min(1);

module.exports = {
  registerSchema,
  loginSchema,
  createPublicacionSchema,
  updatePerfilSchema,
};
