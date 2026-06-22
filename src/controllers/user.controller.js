const userService = require('../services/user.service');

const getPerfil = async (req, res) => {
  try {
    const perfil = await userService.getPerfilCompleto(req.user.id);

    if (!perfil) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(perfil);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message });
  }
};

const updatePerfil = async (req, res) => {
  try {
    const usuario = await userService.updatePerfil(req.user.id, req.body);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      usuario,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }
};

module.exports = {
  getPerfil,
  updatePerfil,
};
