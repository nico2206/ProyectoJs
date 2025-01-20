const URL_RESERVAS = "http://localhost:3000/reservas";

document.getElementById("form-buscar-reserva").addEventListener("submit", function (event) {
    event.preventDefault();

    const numeroHabitacion = document.getElementById("numeroHabitacion").value;
    const resultadoDiv = document.getElementById("resultado");

    // Limpiar resultados previos
    resultadoDiv.innerHTML = "<p>Buscando...</p>";

    // Consultar reservas
    fetch(URL_RESERVAS)
        .then(response => response.json())
        .then(reservas => {
            // Filtrar por número de habitación
            const reserva = reservas.find(r => r.numeroHabitacion == numeroHabitacion);

            if (reserva) {
                resultadoDiv.innerHTML = `
                    <h3>Reserva encontrada:</h3>
                    <p><strong>Número de Habitación:</strong> ${reserva.numeroHabitacion}</p>
                    <p><strong>Fecha de Entrada:</strong> ${reserva.fechaEntrada}</p>
                    <p><strong>Fecha de Salida:</strong> ${reserva.fechaSalida}</p>
                    <p><strong>Cantidad de Personas:</strong> ${reserva.cantidadPersonas}</p>
                    <p><strong>Estado de Check-in:</strong> ${reserva.checkIn ? "Realizado" : "Pendiente"}</p>
                    <button class="eliminar-btn" onclick="eliminarReserva(${reserva.id})">Eliminar Reserva</button>
                    ${!reserva.checkIn ? `<button class="checkin-btn" onclick="realizarCheckIn(${reserva.id})">Check-in</button>` : ""}
                `;
            } else {
                resultadoDiv.innerHTML = `<p>No se encontró una reserva para la habitación ${numeroHabitacion}.</p>`;
            }
        })
        .catch(error => {
            console.error("Error al buscar las reservas:", error);
            resultadoDiv.innerHTML = `<p>Hubo un error al buscar las reservas. Intenta nuevamente.</p>`;
        });
});

function eliminarReserva(idReserva) {
    const resultadoDiv = document.getElementById("resultado");

    if (confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
        fetch(`${URL_RESERVAS}/${idReserva}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                alert("Reserva eliminada con éxito.");
                resultadoDiv.innerHTML = "<p>La reserva ha sido eliminada.</p>";
            } else {
                throw new Error("Error al eliminar la reserva.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar la reserva:", error);
            alert("Hubo un error al intentar eliminar la reserva.");
        });
    }
}

function realizarCheckIn(idReserva) {
    fetch(`${URL_RESERVAS}/${idReserva}`)
        .then(response => response.json())
        .then(reserva => {
            if (reserva) {
                const reservaActualizada = {
                    ...reserva,
                    checkIn: true
                };

                fetch(`${URL_RESERVAS}/${idReserva}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reservaActualizada)
                })
                .then(response => {
                    if (response.ok) {
                        alert("Check-in realizado con éxito.");
                        document.getElementById("resultado").innerHTML = `<p>El check-in fue exitoso para la habitación ${reserva.numeroHabitacion}.</p>`;
                    } else {
                        throw new Error("Error al realizar el check-in.");
                    }
                })
                .catch(error => {
                    console.error("Error al realizar el check-in:", error);
                    alert("Hubo un error al realizar el check-in.");
                });
            }
        })
        .catch(error => {
            console.error("Error al buscar la reserva para check-in:", error);
            alert("Hubo un error al obtener los datos de la reserva.");
        });
}