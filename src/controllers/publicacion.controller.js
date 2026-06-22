const publicacionService = require('../services/publicacion.service');

const getAll = async (req, res) => {
  try {
    const publicaciones = await publicacionService.getAll();
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las publicaciones', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const publicacion = await publicacionService.create(req.user.id, req.body);

    res.status(201).json({
      message: 'Publicacion creada exitosamente',
      publicacion,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la publicacion', error: error.message });
  }
};

module.exports = {
  getAll,
  create,
};
