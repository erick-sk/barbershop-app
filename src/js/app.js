document.addEventListener("DOMContentLoaded", function () {
  startApp();
});

function startApp() {
  ShowServices();
}

async function ShowServices() {
  try {
    const result = await fetch("./services.json");
    const db = await result.json();

    const { services } = db;

    // Generate HTML
    services.forEach((service) => {
      const { id, name, price } = service;

      // DOM Scripting
      // Generate name of service
      const nameService = document.createElement("P");
      nameService.textContent = name;
      nameService.classList.add("name-service");

      // Generate price of service
      const priceService = document.createElement("P");
      priceService.textContent = `$ ${price}`;
      priceService.classList.add("price-service");

      // Generate DIV container of service
      const serviceDiv = document.createElement("DIV");
      serviceDiv.classList.add("service");
      serviceDiv.dataset.idService = id;

      // Select serviceDIV
      serviceDiv.onclick = selectService; //event handler

      // Add name and prince in a DIV
      serviceDiv.appendChild(nameService);
      serviceDiv.appendChild(priceService);

      // Add serviceDiv in a HTML
      document.querySelector("#services").appendChild(serviceDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

function selectService(e) {
  let element;

  // Force element click to DIV
  if (e.target.tagName === "P") {
    element = e.target.parentElement;
  } else {
    element = e.target;
  }

  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
  } else {
    element.classList.add("selected");
  }
}
