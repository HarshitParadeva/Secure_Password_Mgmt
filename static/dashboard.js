// Toggle password visibility for saved entries
document.querySelectorAll(".toggle-password-btn").forEach(button => {
    button.addEventListener("click", () => {
        const span = button.previousElementSibling;
        const isHidden = span.textContent.includes("•");
        span.textContent = isHidden ? button.dataset.password : "••••••••";
        button.textContent = isHidden ? "🙈" : "👁️";
    });
});

// Password strength meter
const passwordInput = document.getElementById("site_password");
const strengthMeter = document.getElementById("strengthMeter");

if (passwordInput && strengthMeter) {
    passwordInput.addEventListener("input", () => {
        const val = passwordInput.value;
        strengthMeter.className = "";
        strengthMeter.style.height = "6px";
        if (val.length < 6) {
            strengthMeter.classList.add("weak");
        } else if (val.length < 10) {
            strengthMeter.classList.add("medium");
        } else {
            strengthMeter.classList.add("strong");
        }
    });
}
