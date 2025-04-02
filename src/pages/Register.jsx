import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Alert, Box } from "@mui/material";
import { register } from "../services/authService";

// Estados
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Envio formulario
  const handleSubmit = async () => {
    const result = await register(name, email, password);
    if (result.success) {
      setError("");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Container maxWidth="xs" sx={{ mt: 4, backgroundColor: "white", padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" sx={{ color: "black" }}>Registro</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Registro exitoso, redirigiendo...</Alert>}
        <TextField label="Nombre" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Correo Electrónico" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Registrarse</Button>
      </Container>
    </Box>
  );
};

export default Register;