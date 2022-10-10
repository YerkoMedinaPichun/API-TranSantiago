const d = document,
  $formBusStation = d.querySelector(".form-bus-station"),
  $templateCard = d.querySelector("#template-card").content,
  $templateServicio = d.querySelector("#template-servicio").content,
  $fragment = d.createDocumentFragment();

const obtenerInformacion = async (paradero) => {
  d.querySelector(".loader").classList.remove("none");
  if (d.querySelector(".error")) {
    d.querySelector(".error").textContent = "";
  }
  if (d.querySelector(".data .card")) {
    d.querySelector(".data .card").outerHTML = "";
  }

  fetch(`https://api.xor.cl/red/bus-stop/${paradero}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      d.querySelector(".loader").classList.add("none");
      d.querySelector(".data").innerHTML = `
          <div class="card">
            <div class="contenedor-logo-bus">
            <img class="logo-bus-transantiago" src="logo-bus.svg" alt="Logo Bus Transantiago">
          </div>
          <p class="direccion">${json.name}</p>
            <div class="servicios">
              
            </div>
            </div>
          `;

      json.services.forEach((el) => {
        d.querySelector(".servicios").innerHTML += `
            <div class="servicio">
                <p class="nombre">${el.id}</p>
                <p class="estado" id="${el.id}">${el.status_description}</p>
          
              </div>
            `;

        if (el.valid === true) {
          d.getElementById(el.id).insertAdjacentHTML(
            "afterend",
            `
              <p class="codigo-bus">Bus: <span>${el.buses[0].id}</span></p>
                <p class="tiempo">Llegada: <span>${el.buses[0].min_arrival_time} a ${el.buses[0].max_arrival_time}</span> minutos.</p>
                <p class="distancia">A <span>${el.buses[0].meters_distance}</span> mts del paradero.</p>
              `
          );

          // if (el.buses[1]) {
          //   d.getElementById(el.id).insertAdjacentHTML(
          //     "afterend",
          //     `
          //       <p class="prox-bus">Próximo Bus: <span>${el.buses[1].min_arrival_time} a ${el.buses[1].max_arrival_time}</span> minutos.</p>
          //       `
          //   );
          // } else {
          //   d.getElementById(el.id).insertAdjacentHTML(
          //     "afterend",
          //     `
          //       <p class="prox-bus">No hay más buses disponibles.</p>
          //       `
          //   );
          // }
        }
      });
    })
    .catch((error) => {
      d.querySelector(".loader").classList.add("none");
      console.log(error);
      let message =
        error.statusText ||
        `El Paradero "${$formBusStation.firstElementChild.value}" no es Válido`;
      d.querySelector(
        ".loader"
      ).nextElementSibling.innerHTML = `Error ${error.status}: ${message}`;
    });
};

d.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (e.target === $formBusStation) {
    obtenerInformacion(e.target.paradero.value);
  }
});
