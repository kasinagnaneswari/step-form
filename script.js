let currentStep = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.toggle("active", i === index);
    });

    updateProgress();
}

function updateProgress() {
    const totalSteps = steps.length - 1; // completed steps logic
    const completedSteps = currentStep;

    const percent = (completedSteps / totalSteps) * 100;

    progressBar.style.width = percent + "%";
    progressText.textContent = `Step ${currentStep + 1} of ${steps.length}`;
}

function validateStep() {
    const inputs = steps[currentStep].querySelectorAll("input");
    let valid = true;
    const currentYear = new Date().getFullYear();

    inputs.forEach(input => {
        const error = input.nextElementSibling;
        if (!error || !error.classList.contains("error")) return;

        error.style.display = "none";
        input.classList.remove("invalid");

        const value = input.value.trim();

        // Required validation
        if (input.hasAttribute("required") && !value) {
            error.textContent = "This field is required";
            showError(input, error);
            valid = false;
            return;
        }

        // Letters-only validation
        if (
            ["First Name", "Last Name", "City", "State", "Country", "Highest Qualification", "College"]
                .includes(input.name) &&
            value
        ) {
            const namePattern = /^[A-Za-z\s]+$/;
            if (!namePattern.test(value)) {
                error.textContent = "Only letters are allowed";
                showError(input, error);
                valid = false;
                return;
            }
        }

        // Email validation
        if (input.type === "email" && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                error.textContent = "Enter a valid email address";
                showError(input, error);
                valid = false;
                return;
            }
        }

        // Contact validation
        if (input.name === "Contact" && value) {
            if (!/^[0-9]{10}$/.test(value)) {
                error.textContent = "Enter a valid 10-digit contact number";
                showError(input, error);
                valid = false;
                return;
            }
        }

        // Passed out year validation
        if (input.name === "Passed Out Year" && value) {
            const year = Number(value);
            if (year < 1950 || year > currentYear) {
                error.textContent = `Year must be between 1950 and ${currentYear}`;
                showError(input, error);
                valid = false;
                return;
            }
        }

        // CGPA validation
        if (input.name === "CGPA" && value) {
            const cgpaPattern = /^(10(\.0{1,2})?|[0-9](\.[0-9]{1,2})?)$/;
            if (!cgpaPattern.test(value)) {
                error.textContent = "Enter CGPA between 0.0 and 10.0";
                showError(input, error);
                valid = false;
            }
        }

        // Experience validation
        if (input.name === "Experience" && value) {
            const years = Number(value);
            if (years < 0 || years > 50) {
                error.textContent = "Enter valid experience (0–50 years)";
                showError(input, error);
                valid = false;
            }
        }
    });

    return valid;
}

function showError(input, error) {
    error.style.display = "block";
    input.classList.add("invalid");
}


function nextStep() {
    if (!validateStep()) return;
    currentStep++;
    if (currentStep === steps.length - 1) populateReview();
    showStep(currentStep);
}

function prevStep() {
    currentStep--;
    showStep(currentStep);
}

function populateReview() {
    const data = new FormData(document.getElementById("onboardingForm"));
    let html = '<div class="review-grid">';

    data.forEach((value, key) => {
        html += `
            <div class="review-item">
                <span class="review-label">${key}</span>
                <span class="review-value">${value || "-"}</span>
            </div>
        `;
    });

    html += "</div>";
    document.getElementById("review").innerHTML = html;
}


// Prevent Enter key auto-submit
document.getElementById("onboardingForm").addEventListener("keydown", e => {
    if (e.key === "Enter" && currentStep !== steps.length - 1) {
        e.preventDefault();
    }
});

document.getElementById("onboardingForm").addEventListener("submit", e => {
    e.preventDefault();
    if (currentStep !== steps.length - 1) return;

    document.getElementById("onboardingForm").style.display = "none";
    document.getElementById("successMessage").style.display = "block";
});

showStep(currentStep);
document.querySelectorAll('input').forEach(input => {

    // Allow only letters for name-like fields
    if (["First Name", "Last Name", "City", "State", "Country"].includes(input.name)) {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^A-Za-z\s]/g, "");
        });
    }

    // Allow only numbers for contact
    if (input.name === "Contact") {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "");
        });
    }
});
// Clear errors dynamically when user fixes the input
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
        const error = input.nextElementSibling;
        if (!error || !error.classList.contains("error")) return;

        // Trimmed current value
        const value = input.value.trim();

        // Initially hide error and remove invalid class
        error.style.display = "none";
        input.classList.remove("invalid");

        // Validation checks similar to validateStep but just for clearing errors

        // Required check
        if (input.hasAttribute("required") && !value) {
            // Still empty, keep error hidden (won't show until Next clicked)
            return;
        }

        // Letters-only fields
        if (
            ["First Name", "Last Name", "City", "State", "Country", "Highest Qualification", "College"].includes(input.name)
        ) {
            const namePattern = /^[A-Za-z\s]+$/;
            if (!namePattern.test(value)) {
                error.style.display = "block";
                error.textContent = "Only letters are allowed";
                input.classList.add("invalid");
                return;
            }
        }

        // Email field
        if (input.type === "email" && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                error.style.display = "block";
                error.textContent = "Enter a valid email address";
                input.classList.add("invalid");
                return;
            }
        }

        // Contact number
        if (input.name === "Contact" && value) {
            if (!/^[0-9]{10}$/.test(value)) {
                error.style.display = "block";
                error.textContent = "Enter a valid 10-digit contact number";
                input.classList.add("invalid");
                return;
            }
        }

        // Passed out year validation
        if (input.name === "Passed Out Year" && value) {
            const year = Number(value);
            const currentYear = new Date().getFullYear();
            if (year < 1950 || year > currentYear) {
                error.style.display = "block";
                error.textContent = `Year must be between 1950 and ${currentYear}`;
                input.classList.add("invalid");
                return;
            }
        }

        // CGPA validation
        if (input.name === "CGPA" && value) {
            const cgpaPattern = /^(10(\.0{1,2})?|[0-9](\.[0-9]{1,2})?)$/;
            if (!cgpaPattern.test(value)) {
                error.style.display = "block";
                error.textContent = "Enter CGPA between 0.0 and 10.0";
                input.classList.add("invalid");
                return;
            }
        }

        // Experience validation
        if (input.name === "Experience" && value) {
            const years = Number(value);
            if (years < 0 || years > 50) {
                error.style.display = "block";
                error.textContent = "Enter valid experience (0–50 years)";
                input.classList.add("invalid");
                return;
            }
        }

        // If all validations pass, error stays hidden and red border removed
    });
});
