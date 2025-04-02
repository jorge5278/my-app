const API_URL = "http://localhost:3000/api"; 

const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token.trim()}` : ""; 
};

// Login
const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem("token", data.token);  
        localStorage.setItem("user", JSON.stringify(data.user)); 
        return data;
    } else {
        throw new Error(data.message || "Error en el login");
    }
};

// R
const getUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getToken()  
        }
    });

    return response.ok ? await response.json() : null;
};

// C
const createUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      }, 
      body: JSON.stringify(user)
  });

  return response.ok;
};

// U
const updateUser = async (user) => {
    const token = getToken();

    if (!token) {
        console.error("No hay token disponible");
        return false;
    }

    const updatedUser = {
        name: user.name,
        email: user.email,
    };

    if (user.password) {
        updatedUser.password = user.password;  
    }

    const response = await fetch(`${API_URL}/users/${user.Id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token  
        },
        body: JSON.stringify(updatedUser)
    });

    if (!response.ok) {
        console.error("Error al actualizar usuario:", await response.json());
    }

    return response.ok;
};

// D
const deleteUser = async (id) => {
    const token = getToken();

    if (!token) {
        console.error("No hay token disponible");
        return false;
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,  
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error("Error al eliminar usuario:", await response.json());
    }

    return response.ok;
};

// Logout
const logoutUser = () => {
    localStorage.removeItem("token");  //Borrar token
    localStorage.removeItem("user");
};

export { loginUser, getUsers, createUser, updateUser, deleteUser, logoutUser };
