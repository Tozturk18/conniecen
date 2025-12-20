// pages/contact/contact.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact_form");
  const btn = document.getElementById("contact_send");
  const status = document.getElementById("contact_status");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    btn.disabled = true;
    const prevText = btn.textContent;
    btn.textContent = "Sending...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" },
      });

      if (res.ok) {
        form.reset();
        status.textContent = "Message sent. Thank you!";
      } else {
        status.textContent = "Could not send. Please try again later.";
      }
    } catch (err) {
      console.error(err);
      status.textContent = "Network error. Please try again.";
    } finally {
      btn.disabled = false;
      btn.textContent = prevText;
    }
  });
});
