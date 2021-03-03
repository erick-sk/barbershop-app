let page = 1;

document.addEventListener("DOMContentLoaded", function () {
  startApp();
});

function startApp() {
  // Show Services
  showServices();

  // Highlights tab pressed
  showSection();

  // Hides or showa a section tab pressed
  changeSection();
}

function showSection() {
  const currentSection = document.querySelector(`#step-${page}`);
  currentSection.classList.add("show-section");

  // Highlight current tab

  const tab = document.querySelector(`[data-step="${page}"]`);
  tab.classList.add("current");
}

function changeSection() {
  const links = document.querySelectorAll(".tabs button");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      page = parseInt(e.target.dataset.step);

      // Delete show-section from previous section
      document.querySelector(".show-section").classList.remove("show-section");

      // Add show-section where click
      const section = document.querySelector(`#step-${page}`);
      section.classList.add("show-section");

      // Delete current class previous tab
      document.querySelector(".tabs .current").classList.remove("current");

      // Add current class tab
      const tab = document.querySelector(`[data-step="${page}"]`);
      tab.classList.add("current");
    });
  });
}

async function showServices() {
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
