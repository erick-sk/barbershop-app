let page = 1;

const appointment = {
  name: "",
  date: "",
  time: "",
  services: [],
};

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

  // Paging back and next
  nextPage();

  backPage();

  // Checks the current page to hide or show the page layout
  pagersButtons();

  // Show quote summary or validation error
  showSummary();
}

function showSection() {
  // Delete show-section from previous section
  const backSection = document.querySelector(".show-section");
  if (backSection) {
    backSection.classList.remove("show-section");
  }

  const currentSection = document.querySelector(`#step-${page}`);
  currentSection.classList.add("show-section");

  // Delete current class previous tab
  const backTab = document.querySelector(".tabs .current");
  if (backTab) {
    backTab.classList.remove("current");
  }

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

      // Call to function showSection();
      showSection();

      pagersButtons();
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

function nextPage() {
  const nextPage = document.querySelector("#next");
  nextPage.addEventListener("click", () => {
    page++;
    console.log(page);

    pagersButtons();
  });
}

function backPage() {
  const backPage = document.querySelector("#back");
  backPage.addEventListener("click", () => {
    page--;
    console.log(page);

    pagersButtons();
  });
}

function pagersButtons() {
  const nextPage = document.querySelector("#next");
  const backPage = document.querySelector("#back");

  if (page === 1) {
    backPage.classList.add("hide");
  } else if (page === 3) {
    nextPage.classList.add("hide");
    backPage.classList.remove("hide");
  } else {
    backPage.classList.remove("hide");
    nextPage.classList.remove("hide");
  }

  showSection(); // Change section to show page
}

function showSummary() {
  // Destructuring
  const { name, date, time, services } = appointment;

  // Select Summary
  const summaryDiv = document.querySelector(".content-summary");

  // Object validation

  if (Object.values(appointment).includes("")) {
    const noServices = document.createElement("P");
    noServices.textContent = "Service data are missing, time, date or name";

    noServices.classList.add("invalidate-appointment");

    // Add to summaryDiv
    summaryDiv.appendChild(noServices);
  }
}
