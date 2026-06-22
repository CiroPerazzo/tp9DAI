const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { nombre_usuario, email } = req.body;

    const existingEmail = await authService.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya esta registrado' });
    }

    const existingUsername = await authService.findByUsername(nombre_usuario);
    if (existingUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya esta en uso' });
    }

    const usuario = await authService.createUser(req.body);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await authService.validateCredentials(email, password);

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        foto_perfil: usuario.foto_perfil,
        biografia: usuario.biografia,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesion', error: error.message });
  }
};

module.exports = {
  register,
  login,
};
