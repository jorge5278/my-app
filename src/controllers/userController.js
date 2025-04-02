import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hana, poolPromise } from "../config/dbConfig.js";

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    const pool = await poolPromise;
    const query = `SELECT Id, Name, Email, PasswordHash FROM users WHERE Email = ?`;

    pool.exec(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (result.length === 0) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.PASSWORDHASH);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      // JWT
      const token = jwt.sign(
        { userId: user.ID, email: user.EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );


      const updateQuery = `UPDATE users SET LastLogin = CURRENT_TIMESTAMP WHERE Id = ?`;
      pool.exec(updateQuery, [user.ID]);

      res.json({
        message: "Login exitoso",
        token,
        user: {
          Id: user.ID,
          Name: user.NAME,
          Email: user.EMAIL,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// R
export const getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const query = "SELECT * FROM users";

    pool.exec(query, [], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(result);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// R
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const query = "SELECT * FROM users WHERE Id = ?";

    pool.exec(query, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(result[0]);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// C
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    const pool = await poolPromise;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users (Name, Email, PasswordHash, CreatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;

    pool.exec(query, [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: "Usuario creado exitosamente" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// U
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const pool = await poolPromise;

    // Obtener contraseña actual si no se envia una nueva
    let hashedPassword = null;
    const queryGetPassword = "SELECT PasswordHash FROM users WHERE Id = ?";
    pool.exec(queryGetPassword, [id], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      hashedPassword = result[0].PASSWORDHASH; // Mantener contraseña actual

      // Hash de la nueva contraseña
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      const updateQuery = `
        UPDATE users 
        SET Name = ?, Email = ?, PasswordHash = ?
        WHERE Id = ?`;

      pool.exec(updateQuery, [name, email, hashedPassword, id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Usuario actualizado correctamente" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// D
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const query = "DELETE FROM users WHERE Id = ?";

    pool.exec(query, [id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario eliminado correctamente" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
