import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../services/usersService";
import { Container, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";

const Users = () => {
  // Estados
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ name: "", email: "", password: "" });
  const [newUserData, setNewUserData] = useState({ name: "", email: "", password: "" });

  // Cargar los usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  // Ordenado de la lista de usuarios
  const loadUsers = async () => {
    const data = await getUsers();
    if (data) {
      const sortedData = data.sort((a, b) => a.ID - b.ID);
      setUsers(sortedData);
    } else {
      setUsers([]);
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user.ID);
    setEditUserData({ name: user.NAME, email: user.EMAIL, password: "" });
  };

  // Actualizar usuario
  const handleUpdate = async () => {
    if (editUserId) {
      await updateUser({ Id: editUserId, ...editUserData });
      setEditUserId(null);
      loadUsers(); // Recargar lista
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  // Crear usuario
  const handleCreate = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      alert("Todos los campos son obligatorios para crear un usuario");
      return;
    }

    await createUser(newUserData);
    setNewUserData({ name: "", email: "", password: "" }); 
    loadUsers();
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2, color: "black" }}>Gestión de Usuarios</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ color: "black" }}>Crear Nuevo Usuario</Typography>
        <TextField
          fullWidth
          label="Nombre"
          value={newUserData.name}
          onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={newUserData.email}
          onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={newUserData.password}
          onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreate}>Crear Usuario</Button>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contraseña</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.ID}>
                <TableCell>{user.ID}</TableCell>

                {editUserId === user.ID ? (
                  <>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={editUserData.name}
                        onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        value={editUserData.email}
                        onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        type="password"
                        placeholder="Nueva contraseña"
                        value={editUserData.password}
                        onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <Button color="primary" onClick={handleUpdate}>Guardar</Button>
                      <Button color="error" onClick={() => setEditUserId(null)}>Cancelar</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{user.NAME}</TableCell>
                    <TableCell>{user.EMAIL}</TableCell>
                    <TableCell>••••••••</TableCell>
                    <TableCell>
                      <Button color="primary" onClick={() => handleEditClick(user)}>Editar</Button>
                      <Button color="error" onClick={() => handleDelete(user.ID)}>Eliminar</Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Users;
