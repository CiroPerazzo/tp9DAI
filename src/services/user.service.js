const pool = require('../config/db');

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, nombre_usuario, nombre_completo, email, foto_perfil, biografia
     FROM usuarios WHERE id = $1`,
    [id]
  );
  return rows[0];
};

const getPerfilCompleto = async (userId) => {
  const { rows } = await pool.query(
    `SELECT
       u.id,
       u.nombre_usuario,
       u.nombre_completo,
       u.email,
       u.foto_perfil,
       u.biografia,
       COUNT(p.id)::INT AS publicaciones,
       COALESCE(SUM(p.likes), 0)::INT AS likes_totales
     FROM usuarios u
     LEFT JOIN publicaciones p ON p.usuario_id = u.id
     WHERE u.id = $1
     GROUP BY u.id, u.nombre_usuario, u.nombre_completo, u.email, u.foto_perfil, u.biografia`,
    [userId]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const usuario = {
    id: row.id,
    nombre_usuario: row.nombre_usuario,
    nombre_completo: row.nombre_completo,
    email: row.email,
    foto_perfil: row.foto_perfil,
    biografia: row.biografia,
  };
  const contadores = {
    publicaciones: row.publicaciones,
    likes_totales: row.likes_totales,
  };

  const { rows: publicaciones } = await pool.query(
    `SELECT id, url_imagen, descripcion, likes, fecha_creacion
     FROM publicaciones
     WHERE usuario_id = $1
     ORDER BY fecha_creacion DESC`,
    [userId]
  );

  return {
    usuario,
    contadores,
    publicaciones,
  };
};

const updatePerfil = async (userId, { nombre_completo, foto_perfil, biografia }) => {
  const { rows } = await pool.query(
    `UPDATE usuarios
     SET
       nombre_completo = COALESCE($2, nombre_completo),
       foto_perfil = COALESCE($3, foto_perfil),
       biografia = COALESCE($4, biografia)
     WHERE id = $1
     RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia`,
    [userId, nombre_completo ?? null, foto_perfil ?? null, biografia ?? null]
  );

  return rows[0];
};

module.exports = {
  findById,
  getPerfilCompleto,
  updatePerfil,
};
