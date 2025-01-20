const fechaEntrada = document.getElementById("fechaInicio");
const fechaSalida = document.getElementById("fechaFin");
const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });

       
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });

const url = "http://localhost:3000/habitaciones"
const URL = "http://localhost:3000/reservas"


document.getElementById("form-reserva").addEventListener("submit", function(event) {
    event.preventDefault(); 
    const fechaEntrada1 = new Date(fechaEntrada.value);
    const fechaSalida1 = new Date(fechaSalida.value);
    const fechaActual = new Date();
    if (fechaEntrada1 < fechaActual) {
        alert("INGRESA UNA FECHA VALIDA");
        return;
    }
    if (fechaSalida1 < fechaEntrada1) {
        alert('La fecha de salida no puede ser antes de la fecha de entrada. Por favor, selecciona una fecha válida.');
        return; 
    }
    buscarHabitaciones()
});

function buscarHabitaciones (){
    const buscarBtn = document.getElementById("buscar");

buscarBtn.addEventListener("click", (e) =>{
    e.preventDefault();

    const numeroPersonas = document.getElementById("cantidadPersonas");
    const cantidadPersonas = parseInt(numeroPersonas.value);
    const resultadoDiv = document.getElementById("resultado");

    alert("BUSCANDO...");

    fetch(url)
    .then(response => response.json())
    .then(habitaciones => {
        const habitacionesDisponibles = habitaciones.filter(habitacion =>
            habitacion.personas === cantidadPersonas && 
            habitacion.estado.toLowerCase() === "disponible"
        );

        if (habitacionesDisponibles.length > 0) {
            habitacionesDisponibles.forEach(habitacion => {
                const divHabitacion = document.createElement("div");
                divHabitacion.classList.add("habitacion");

                divHabitacion.innerHTML = `
                    <h3>Tipo: ${habitacion.tipo}</h3>
                    <p>Capacidad: ${habitacion.personas} personas</p>
                    <p>Número de Habitación: ${habitacion.numero}
                    <p>Estado: ${habitacion.estado}</p>
                    <p>Precio por noche: $${habitacion.precio}</p>
                    <<img src="${habitacion.imagen}" alt="Imagen de la habitación" class="imagen-habitacion" />
                    <button onclick="reservar(${habitacion.id})">Reservar</button>
                `;
                resultadoDiv.appendChild(divHabitacion);
            });
        } else {
            resultadoDiv.innerHTML += "<p>No se encontraron habitaciones disponibles con los criterios seleccionados.</p>";
        }
    })
    .catch(error => {
        console.error("Error al obtener las habitaciones:", error);
        alert("Hubo un error al obtener los datos.");
    });
});
}

function reservar(idHabitacion) {
    const fechaEntrada = document.getElementById("fechaInicio").value;
    const fechaSalida = document.getElementById("fechaFin").value;
    const cantidadPersonas = document.getElementById("cantidadPersonas").value;

    
    fetch(`${url}/${idHabitacion}`)
        .then(response => response.json())
        .then(habitacion => {
            if (!habitacion) {
                alert("No se encontró la habitación.");
                return;
            }

            const nuevaReserva = {
                habitacionId: idHabitacion,
                numeroHabitacion: habitacion.numero, 
                fechaEntrada: fechaEntrada,
                fechaSalida: fechaSalida,
                cantidadPersonas: parseInt(cantidadPersonas)
            };

            fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevaReserva)
            })
            .then(response => {
                if (response.ok) {
                    
                    return fetch(`${url}/${idHabitacion}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ estado: "ocupado" })
                    });
                } else {
                    throw new Error("Error al realizar la reserva.");
                }
            })
            
            .then(response => {
                if (response.ok) {
                    alert(`Reserva realizada con éxito. Recuerda el número de habitación: ${habitacion.numero} para modificar.`);
                    document.getElementById("resultado").innerHTML = "";
                    document.getElementById("form-reserva").reset();
                } else {
                    throw new Error("Error al realizar la reserva.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Hubo un error al realizar la reserva. Inténtalo de nuevo.");
            });
        })
        .catch(error => {
            console.error("Error al buscar la habitación:", error);
            alert("Hubo un error al obtener los datos de la habitación.");
        });
}


