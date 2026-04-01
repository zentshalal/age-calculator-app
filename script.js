document.addEventListener("DOMContentLoaded", () => {
    const dayInp = document.querySelector("#days");
    const monthInp = document.querySelector("#months");
    const yearInp = document.querySelector("#years");
    const dateInputs = [dayInp, monthInp, yearInp];
    
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function setError(element, message) {
        element.classList.add("border-red-400");
        element.parentElement.classList.add("text-red-400");
        element.parentElement.querySelector(".warning-msg").textContent = message;
    }

    function delError(element) {
        element.classList.remove("border-red-400");
        element.parentElement.classList.remove("text-red-400");
        element.parentElement.querySelector(".warning-msg").textContent = "";
    }

    function validateInput(element) {
        const rawValue = element.value.trim();
        const numValue = Number(rawValue);

        // Checks if empty
        if (rawValue === "") {
            setError(element, "This field is required");
            return false;
        }

        // Checks if date is in range
        if (element === dayInp) {
            const max = daysInMonths[Number(monthInp.value) - 1] || 31;
            if (numValue < 1 || numValue > max) {
                setError(element, "Must be a valid day");
                return false;
            }
        } else if (element === monthInp) {
            if (numValue < 1 || numValue > 12) {
                setError(element, "Must be a valid month");
                return false;
            }
        } else if (element === yearInp) {
            if (numValue > new Date().getFullYear()) {
                setError(element, "Must be in the past");
                return false;
            }
        }

        delError(element);
        return true;
    }

    // Validation au focusout
    dateInputs.forEach(input => {
        input.addEventListener("focusout", () => validateInput(input));
    });

    const button = document.querySelector("button");
    button.addEventListener("click", (e) => {
        e.preventDefault();

        // On valide tous les champs
        const allValid = dateInputs.map(input => validateInput(input)).every(v => v);

        if (allValid) {
            calculateAge(dayInp.value, monthInp.value, yearInp.value);
        }
    });

    function calculateAge(d, m, y) {
        const today = new Date();
        const birthDate = new Date(y, m - 1, d);

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Ajustement si le jour/mois n'est pas encore atteint cette année
        if (days < 0) {
            months--;
            // On récupère le dernier jour du mois précédent
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += lastMonth;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Affichage
        document.querySelector(".year-result").textContent = years;
        document.querySelector(".month-result").textContent = months;
        document.querySelector(".day-result").textContent = days;
    }
});