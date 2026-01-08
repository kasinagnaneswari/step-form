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

    inputs.forEach(input => {
        const error = input.nextElementSibling;
        if (!error || !error.classList.contains("error")) return;

        error.style.display = "none";
        input.classList.remove("invalid");

        if (input.hasAttribute("required") && !input.value.trim()) {
            error.textContent = "This field is required";
            error.style.display = "block";
            input.classList.add("invalid");
            valid = false;
            return;
        }

        if (input.name.includes("CGPA") && input.value.trim()) {
            const cgpaPattern = /^(10(\.0{1,2})?|[0-9](\.[0-9]{1,2})?)$/;
            if (!cgpaPattern.test(input.value.trim())) {
                error.textContent = "Enter valid CGPA (0.0 – 10.0)";
                error.style.display = "block";
                input.classList.add("invalid");
                valid = false;
            }
        }
    });

    return valid;
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
    let html = "<ul>";
    data.forEach((v, k) => html += `<li><strong>${k}:</strong> ${v}</li>`);
    html += "</ul>";
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
