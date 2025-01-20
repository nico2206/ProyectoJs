const inicio = document.querySelector('.inicioSeccion');
const inicio1 = document.querySelector('.ingreso');
const registroInicio1 = document.querySelector('.registroInicio');
const registro1 = document.querySelector('.registro');
const url = "http://localhost:3000/usuarios";

inicio.addEventListener('click', () => {
    inicio1.classList.toggle('active');
});
 document.querySelectorAll('.ingreso a').forEach(link => {
     link.addEventListener('click', () => {
         inicio1.classList.remove('active');
     });
 });
 document.addEventListener('click', (e) => {
     if (!inicio1.contains(e.target) && !inicio.contains(e.target)) {
         inicio1.classList.remove('active');
     }
 });

registroInicio1.addEventListener('click', () => {
    registro1.classList.toggle('active');
});
document.querySelectorAll('.registro a').forEach(link => {
    link.addEventListener('click', () => {
        registro1.classList.remove('active');
    });
});
document.addEventListener('click', (e) => {
    if (!registro1.contains(e.target) && !registroInicio1.contains(e.target)) {
        registro1.classList.remove('active');
    }
});

const registrarUsuarioBtn = document.getElementById('registrarUsuario');

registrarUsuarioBtn.addEventListener('click', (e) => {
  e.preventDefault(); 
  const nombre = document.getElementById('nombreRegistro').value;
  const contrasena = document.getElementById('contrasenaRegistro').value;
  const nuevoUsuario = { nombre, contrasena };

 
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoUsuario),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Usuario registrado:", data);
    alert("Registro exitoso");
  })
  .catch(error => {
    console.error("Error al registrar el usuario:", error);
    alert("Hubo un error al registrar el usuario");
  });
});

const iniciarSesionBtn = document.getElementById('iniciarSesion');

iniciarSesionBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    const nombreInicio = document.getElementById('nombreInicio').value;
    const contrasenaInicio = document.getElementById('contrasenaInicio').value;
    fetch(url)
        .then(response => response.json())
        .then(usuarios => {
            const usuarioEncontrado = usuarios.find(usuario => 
                usuario.nombre === nombreInicio && usuario.contrasena === contrasenaInicio 
            );

            if (usuarioEncontrado) {
                console.log("Usuario encontrado:", usuarioEncontrado);
                alert("Inicio de sesión exitoso");
                window.location.href = "./reservas.html";
            

            } else {
                alert("Nombre o contraseña incorrectos");
            }
        })
        .catch(error => {
            console.error("Error al verificar el usuario:", error);
            alert("Hubo un error al iniciar sesión");
        });
});
