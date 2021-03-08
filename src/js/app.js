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

  // Stores the name of the date in the object
  nameAppointment();

  // Stores the date of the date in the object
  dateAppointment();

  // Disable past days
  disablePreviousDays();

  // Stores the time of the date in the object
  timeAppointment();
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

    const id = parseInt(element.dataset.idService);

    deleteService(id);
  } else {
    element.classList.add("selected");

    const serviceObj = {
      id: parseInt(element.dataset.idService),
      name: element.firstElementChild.textContent,
      price: element.firstElementChild.nextElementSibling.textContent,
    };

    addService(serviceObj);
  }
}

function deleteService(id) {
  const { services } = appointment;
  appointment.services = services.filter((service) => service.id !== id);

  console.log(appointment);
}

function addService(serviceObj) {
  const { services } = appointment;

  appointment.services = [...services, serviceObj];
  console.log(appointment);
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

function nameAppointment() {
  const nameInput = document.querySelector("#name");

  nameInput.addEventListener("input", (e) => {
    const nameText = e.target.value.trim();

    // Validate name exist
    if (nameText === "" || nameText.length < 3) {
      showAlert("Name no validate", "error");
    } else {
      const alert = document.querySelector(".alert");
      if (alert) {
        alert.remove();
      }
      appointment.name = nameText;
    }
  });
}

function showAlert(message, type) {
  // If an alert already exists, don't create another one
  const backAlert = document.querySelector(".alert");
  if (backAlert) {
    return;
  }

  const alert = document.createElement("DIV");
  alert.textContent = message;
  alert.classList.add("alert");

  if (type == "error") {
    alert.classList.add("error");
  }

  // Insert in HTML
  const form = document.querySelector(".form");
  form.appendChild(alert);

  // Delete alert on time 3 seconds

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

function dateAppointment() {
  const dateInput = document.querySelector("#date");
  dateInput.addEventListener("input", (e) => {
    const day = new Date(e.target.value).getUTCDay();

    if ([0, 6].includes(day)) {
      e.preventDefault();
      dateInput.value = "";
      showAlert("Day Close", "error");
    } else {
      appointment.date = dateInput.value;
      console.log(appointment);
    }
  });
}

function disablePreviousDays() {
  const inputDate = document.querySelector("#date");

  // const dateNow = new Date();
  // const year = dateNow.getFullYear();
  // const month = dateNow.getMonth() + 1;
  // const day = dateNow.getDate() + 1;

  // Format YYYY-MM-DD

  // const dateDisable = `${year}-${month}-${day}`;

  const dateDisable = new Date().toISOString().split("T")[0]; // Solution '2020-3-3' => '2020-03-03'

  inputDate.min = dateDisable;
}

function timeAppointment() {
  const inputTime = document.querySelector("#time");
  inputTime.addEventListener("input", (e) => {
    const timeAppointment = e.target.value;
    const time = timeAppointment.split(":");

    if (time[0] < 10 || time[0] > 18) {
      showAlert("Time fail", "error");
      setTimeout(() => {
        inputTime.value = "";
      }, 2000);
    } else {
      appointment.time = timeAppointment;
      console.log(appointment);
    }
  });
}
