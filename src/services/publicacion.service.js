const pool = require('../config/db');

const getAll = async () => {
  const { rows } = await pool.query(
    `SELECT
       p.id,
       p.usuario_id,
       p.url_imagen,
       p.descripcion,
       p.likes,
       p.fecha_creacion,
       u.nombre_usuario,
       u.foto_perfil
     FROM publicaciones p
     INNER JOIN usuarios u ON u.id = p.usuario_id
     ORDER BY p.fecha_creacion DESC`
  );
  return rows;
};

const create = async (usuarioId, { url_imagen, descripcion }) => {
  const { rows } = await pool.query(
    `INSERT INTO publicaciones (usuario_id, url_imagen, descripcion)
     VALUES ($1, $2, $3)
     RETURNING id, usuario_id, url_imagen, descripcion, likes, fecha_creacion`,
    [usuarioId, url_imagen, descripcion || null]
  );
  return rows[0];
};

module.exports = {
  getAll,
  create,
};
