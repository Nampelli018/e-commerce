document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const amountInput = document.getElementById("amount");
  const descriptionInput = document.getElementById("description");
  const categoryInput = document.getElementById("category");
  const submitButton = document.getElementById("submit");
  const tableBody = document.getElementById("tableBody");
  let editIndex = -1; // Track the index for editing

  submitButton.addEventListener("click", function () {
    const amount = amountInput.value;
    const description = descriptionInput.value;
    const category = categoryInput.value;

    if (amount && description && category) {
      const rowData = {
        amount,
        description,
        category,
      };

      if (editIndex !== -1) {
        editInCrudCrudAPI(rowData, editIndex);
        editIndex = -1; // Reset the edit index
        submitButton.textContent = "Add Expense";
      } else {
        addToCrudCrudAPI(rowData);
      }

      updateTable();
      clearFormInputs();
    } else {
      alert("Please fill in all fields.");
    }
  });

  function addToCrudCrudAPI(data) {
    fetch(
      "https://crudcrud.com/api/b6ce7ccfc3644699ae9b64530c90caf7/e-commerce",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the API response here if needed
        console.log("Expense added:", responseData);
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
      });
  }

  function editInCrudCrudAPI(data, index) {
    fetch(
      `https://crudcrud.com/api/b6ce7ccfc3644699ae9b64530c90caf7/e-commerce/${index}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the API response here if needed
        console.log("Expense updated:", responseData);
      })
      .catch((error) => {
        console.error("Error updating expense:", error);
      });
  }

  function updateTable() {
    fetch(
      "https://crudcrud.com/api/b6ce7ccfc3644699ae9b64530c90caf7/e-commerce"
    )
      .then((response) => response.json())
      .then((data) => {
        let tableHTML = "";
        data.forEach(function (expense, index) {
          tableHTML += "<tr>";
          tableHTML += `<td>${expense.amount}</td>`;
          tableHTML += `<td>${expense.description}</td>`;
          tableHTML += `<td>${expense.category}</td>`;
          tableHTML += `<td><button class="edit btn btn-success" data-index="${expense._id}">Edit Expense</button></td>`;
          tableHTML += `<td><button class="delete btn btn-danger" data-index="${expense._id}">Delete Expense</button></td></tr>`;
        });
        tableBody.innerHTML = tableHTML;
        setEditDeleteListeners();
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  }

  function setEditDeleteListeners() {
    const editButtons = document.querySelectorAll(".edit");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.getAttribute("data-index");
        editIndex = index; // Set the edit index
        populateFormWithOldData(index);
        submitButton.textContent = "Edit";
      });
    });

    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.getAttribute("data-index");
        deleteFromCrudCrudAPI(index);
      });
    });
  }

  function deleteFromCrudCrudAPI(index) {
    fetch(
      `https://crudcrud.com/api/b6ce7ccfc3644699ae9b64530c90caf7/e-commerce/${index}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Expense deleted.");
          updateTable();
        } else {
          console.error("Error deleting expense.");
        }
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  }

  function populateFormWithOldData(index) {
    fetch(
      `https://crudcrud.com/api/b6ce7ccfc3644699ae9b64530c90caf7/e-commerce/${index}`
    )
      .then((response) => response.json())
      .then((data) => {
        amountInput.value = data.amount;
        descriptionInput.value = data.description;
        categoryInput.value = data.category;
      })
      .catch((error) => {
        console.error("Error fetching expense data:", error);
      });
  }

  function clearFormInputs() {
    amountInput.value = "";
    descriptionInput.value = "";
    categoryInput.value = "none";
  }

  updateTable();
});
