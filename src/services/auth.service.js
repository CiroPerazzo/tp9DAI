const bcrypt = require('bcrypt');
const pool = require('../config/db');

const DEFAULT_FOTO_PERFIL = 'https://placekitten.com/200/200';

const findByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0];
};

const findByUsername = async (nombreUsuario) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1', [nombreUsuario]);
  return rows[0];
};

const createUser = async ({ nombre_usuario, nombre_completo, email, password, foto_perfil, biografia }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const fotoPerfil = foto_perfil || DEFAULT_FOTO_PERFIL;

  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre_usuario, nombre_completo, email, password, foto_perfil, biografia)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nombre_usuario, nombre_completo, email, foto_perfil, biografia`,
    [nombre_usuario, nombre_completo, email, hashedPassword, fotoPerfil, biografia || null]
  );

  return rows[0];
};

const validateCredentials = async (email, password) => {
  const user = await findByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  findByEmail,
  findByUsername,
  createUser,
  validateCredentials,
};
