document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addBtn");
    const resetBtn = document.getElementById("resetBtn");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeSelect = document.getElementById("type");
    const entryList = document.getElementById("entryList");
    const netBalanceElement = document.getElementById("netBalance");

    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    // Update net balance
    function updateBalance() {
        let totalIncome = 0;
        let totalExpense = 0;
        entries.forEach(entry => {
            if (entry.type === "income") {
                totalIncome += parseFloat(entry.amount);
            } else {
                totalExpense += parseFloat(entry.amount);
            }
        });
        const netBalance = totalIncome - totalExpense;
        netBalanceElement.textContent = netBalance.toFixed(2);
    }

    // Render entries
    function renderEntries() {
        entryList.innerHTML = "";
        const filterValue = document.querySelector('input[name="filter"]:checked').value;
        const filteredEntries = entries.filter(entry => filterValue === "all" || entry.type === filterValue);

        filteredEntries.forEach(entry => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${entry.description} - ${entry.amount} (${entry.type})</span>
                <button class="edit-btn" data-id="${entry.id}">Edit</button>
                <button class="delete-btn" data-id="${entry.id}">Delete</button>
            `;
            entryList.appendChild(li);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", () => {
                const entryId = button.getAttribute("data-id");
                const entry = entries.find(entry => entry.id === entryId);
                descriptionInput.value = entry.description;
                amountInput.value = entry.amount;
                typeSelect.value = entry.type;
                addBtn.textContent = "Update Entry";
                addBtn.setAttribute("data-edit-id", entryId);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const entryId = button.getAttribute("data-id");
                entries = entries.filter(entry => entry.id !== entryId);
                localStorage.setItem("entries", JSON.stringify(entries));
                renderEntries();
                updateBalance();
            });
        });
    }

    // Add or update an entry
    addBtn.addEventListener("click", () => {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const type = typeSelect.value;

        if (description && !isNaN(amount) && amount > 0) {
            if (addBtn.getAttribute("data-edit-id")) {
                // Update entry
                const entryId = addBtn.getAttribute("data-edit-id");
                const entryIndex = entries.findIndex(entry => entry.id === entryId);
                entries[entryIndex] = { id: entryId, description, amount, type };
                addBtn.removeAttribute("data-edit-id");
                addBtn.textContent = "Add Entry";
            } else {
                // Add new entry
                const newEntry = {
                    id: Date.now().toString(),
                    description,
                    amount,
                    type
                };
                entries.push(newEntry);
            }

            localStorage.setItem("entries", JSON.stringify(entries));
            renderEntries();
            updateBalance();
            descriptionInput.value = "";
            amountInput.value = "";
        }
    });

    // Reset input fields
    resetBtn.addEventListener("click", () => {
        descriptionInput.value = "";
        amountInput.value = "";
    });

    // Filter entries when radio buttons change
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener("change", renderEntries);
    });

    // Initialize app
    renderEntries();
    updateBalance();
});
