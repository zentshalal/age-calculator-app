/**
 * Age Calculator App - Main Logic
 * Handles user input validation and precise age calculation.
 * Author: zentshalal
 */

document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements for Day, Month, and Year inputs
    const dayInp = document.querySelector("#days");
    const monthInp = document.querySelector("#months");
    const yearInp = document.querySelector("#years");
    const dateInputs = [dayInp, monthInp, yearInp];
    
    // Array representing days in each month (index 0 = January)
    // Note: February (28) is handled dynamically for leap years in validation logic if needed
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /**
     * Displays an error message and applies red styling to the input field.
     * @param {HTMLElement} element - The input element to highlight.
     * @param {string} message - The error message to display.
     */
    function setError(element, message) {
        element.classList.add("border-red-400");
        element.parentElement.classList.add("text-red-400");
        element.parentElement.querySelector(".warning-msg").textContent = message;
    }

    /**
     * Clears error messages and resets styling to default.
     * @param {HTMLElement} element - The input element to clean.
     */
    function delError(element) {
        element.classList.remove("border-red-400");
        element.parentElement.classList.remove("text-red-400");
        element.parentElement.querySelector(".warning-msg").textContent = "";
    }

    /**
     * Validates a single input field based on specific rules (range, empty, future date).
     * @param {HTMLElement} element - The input element to validate.
     * @returns {boolean} - True if valid, False otherwise.
     */
    function validateInput(element) {
        const rawValue = element.value.trim();
        const numValue = Number(rawValue);

        // Check 1: Ensure field is not empty
        if (rawValue === "") {
            setError(element, "This field is required");
            return false;
        }

        // Check 2: Validate specific ranges based on the input type
        if (element === dayInp) {
            // Dynamic max days based on selected month (fallback to 31 if month invalid)
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
            // Prevent future dates
            if (numValue > new Date().getFullYear()) {
                setError(element, "Must be in the past");
                return false;
            }
        }

        // Clear errors if validation passes
        delError(element);
        return true;
    }

    // Attach 'focusout' event listener to each input for real-time validation
    dateInputs.forEach(input => {
        input.addEventListener("focusout", () => validateInput(input));
    });

    // Handle Calculate Button Click
    const button = document.querySelector("button");
    button.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission or default behavior

        // Validate all fields before calculation
        const allValid = dateInputs.map(input => validateInput(input)).every(v => v);

        if (allValid) {
            calculateAge(dayInp.value, monthInp.value, yearInp.value);
        }
    });

    /**
     * Calculates the precise age (years, months, days) between birth date and today.
     * Handles edge cases where the birth day/month hasn't occurred yet in the current year.
     * @param {string} d - Day of birth.
     * @param {string} m - Month of birth.
     * @param {string} y - Year of birth.
     */
    function calculateAge(d, m, y) {
        const today = new Date();
        // Note: Month is 0-indexed in JS Date (0 = January), so we subtract 1
        const birthDate = new Date(y, m - 1, d);

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Adjust calculation if the birth day hasn't occurred yet in the current month
        if (days < 0) {
            months--;
            // Get the number of days in the previous month to borrow correctly
            // Date(year, month, 0) returns the last day of the previous month
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += lastMonth;
        }

        // Adjust calculation if the birth month hasn't occurred yet in the current year
        if (months < 0) {
            years--;
            months += 12;
        }

        // Update the DOM with the calculated results
        document.querySelector(".year-result").textContent = years;
        document.querySelector(".month-result").textContent = months;
        document.querySelector(".day-result").textContent = days;
    }
});