/*Cambiar el encabezado de fondo*/
const scrollHeader = () => {
    const header = document.getElementById('header');

    this.scrollY >= 20 
        ? header.classList.add('scroll-header')
        : header.classList.remove('scroll-header');
};

window.addEventListener('scroll', scrollHeader);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".accordion-header .toggle-btn").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que se dispare en toda la card
      const header = toggle.closest(".accordion-header");
      const content = header.nextElementSibling;

      content.classList.toggle("open");
      header.classList.toggle("active");
    });
  });
});