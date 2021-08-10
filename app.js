const companyInput = document.getElementById("companyInput");
const phoneInput = document.getElementById("phoneInput");
const validateBtn = document.getElementById("validateBtn");
const searchBtn = document.getElementById("searchBtn");
const downloadBtn = document.getElementById("download");
const resultsTable = document.getElementById("results");
const errorMsg = document.getElementById("error")

let companies = [];
let customers = [];

//Fetch data and save as a variable.
fetch("./companies.json")
  .then((res) => res.json())
  .then((data) => (companies = data));

fetch("./customers.json")
  .then((res) => res.json())
  .then((data) => (customers = data));

//Returns an array with company names matching the query.
function search(objects, query) {
  let result = [];
  for (let obj of objects) {
    if (obj.name.toLowerCase().includes(query.toLowerCase())) {
      result.push(obj);
    }
  }
  return result;
}

//Adds a row to the table with company details.
function displayCompany(obj, table) {
  table.innerHTML += `<tr>
    <td>${obj.name}</td>
    <td>${obj.code}</td>
    <td>${obj.domain}</td>
    </tr>`;
}

//Clears the table of elements
function clearTable(table) {
  table.innerHTML =
    "<tr><th>Company Name</th><th>Company Code</th><th>Company Domain</th></tr>";
}

//Expands customer object with his proper company.
function addCompanyToCustomer(customers, companies) {
  let result = [];
  for (customer of customers) {
    for (company of companies) {
      if (customer.companyCode === company.code) {
        customer.company = company;
        result.push(customer);
      }
    }
  }
  return result;
}

//Download array as a JSON file
function downloadCustomers(content) {
  const a = document.createElement("a");
  let file = new Blob([JSON.stringify(content)], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "customers.json";
  a.click();
}

//Shows previously hidden element as feedback
function showError(bool, element, name) {
  if (bool) {
    element.classList.replace("hidden", "valid");
    element.classList.replace("invalid", "valid");
    element.innerText = `This ${name} is valid!`
  } else {
    element.classList.replace("hidden", "invalid");
    element.classList.replace("valid", "invalid");
    element.innerText = `Please, enter a proper ${name}!`
  }
}

searchBtn.addEventListener("click", () => {
  clearTable(resultsTable);
  let foundCompanies = search(companies, companyInput.value);
  for (company of foundCompanies) {
    displayCompany(company, resultsTable);
  }
});

downloadBtn.addEventListener("click", () => {
  let newCustomers = addCompanyToCustomer(customers, companies);
  downloadCustomers(newCustomers);
});

validateBtn.addEventListener("click", () => {
  showError(phoneInput.checkValidity(), errorMsg, 'phone number')
  if (phoneInput.checkValidity()) {
    console.log("valid");
  } else {
    console.log("invalid");
  }
});
