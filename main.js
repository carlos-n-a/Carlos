/*Desplácese sobre la animación*/
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".text-gradient").forEach((span) => {
  gsap.to(span, {
    backgroundSize: '100% 100%',
    ease: 'none',
    scrollTrigger: {
      trigger: span,
      start: 'top bottom',
      end: 'top center',
      scrub: true,
    },
  });
});

/*portafolios de filtros mixitup*/

var mixer = mixitup('.work-container', {
    selectors: {
        target: '.mix'
    },
    animation: {
        duration: 300
    }
});

/*activar work*/
const linkWork = document.querySelectorAll('.work-item');

function activeWork() {
  linkWork.forEach((a) => {
    a.classList.remove('active-work');
  });

  this.classList.add('active-work');
}

linkWork.forEach((a) => a.addEventListener('click', activeWork));


/*=========================PRUEBA=============================*/
// =================== Selección de elementos ===================
const cursosView = document.getElementById("cursos-view");
const semanasView = document.getElementById("semanas-view");
const trabajoView = document.getElementById("trabajo-view");

const cursoTitle = document.getElementById("curso-title");
const trabajoTitle = document.getElementById("trabajo-title");
const trabajoDesc = document.getElementById("trabajo-desc");
const trabajoPdf = document.getElementById("trabajo-pdf");
const trabajoDownload = document.getElementById("trabajo-download");

const volverCursos = document.getElementById("volver-cursos");
const volverSemanas = document.getElementById("volver-semanas");

let cursoActual = ""; // Guardar el curso seleccionado

// =================== Datos de semanas (ANTES del trabajo) ===================
const semanas = {
    "Matematica Superior": {
        1: {
            titulo: "Límites", // <-- cambia aquí el título de la tarjeta de la semana
            desc: "Introducción a los límites y su importancia." // <-- cambia aquí la descripción
        },
        2: {
            titulo: "Derivadas",
            desc: "Definición y reglas básicas de derivación."
        }
        // ... hasta semana 16
    },
    "Programacion I": {
        1: {
            titulo: "Algoritmos básicos",
            desc: "Introducción a diagramas de flujo y pseudocódigo."
        },
        2: {
            titulo: "Condicionales",
            desc: "Ejercicios con estructuras if y switch."
        }
        // ... hasta semana 16
    },
    "Arquitectura de Software": {
        1: {
            titulo: "Fundamentos",
            desc: "Conceptos básicos de arquitectura de software."
        },  
        2: {
            titulo: "MVC",
            desc: "Explicación del patrón Modelo-Vista-Controlador."
        }
        // ... hasta semana 16
    }
};

// =================== Datos de trabajos (DENTRO de cada semana) ===================
const trabajos = {
    "Matematica Superior": {
        1: {
            titulo: "Trabajo Semana 1 - Límites",
            desc: "Trabajo sobre introducción a los límites.",
            pdf: "PDF/Fundamentos_de_software.pdf"
        },
        2: {
            titulo: "Trabajo Semana 2 - Derivadas",
            desc: "Ejercicios prácticos de derivadas.",
            pdf: "PDF/Ejemplo1.pdf"
        }
    },
    "Programacion I": {
        1: {
            titulo: "Trabajo Semana 1 - Algoritmos básicos",
            desc: "Ejercicios de diagramas de flujo y pseudocódigo.",
            pdf: "PDF/Fundamentos.pdf"
        },
        2: {
            titulo: "Trabajo Semana 2 - Condicionales",
            desc: "Ejercicios con estructuras if y switch.",
            pdf: "PDF/Programacion_Semana2.pdf"
        }
    },
    "Arquitectura de Software": {
        1: {
            titulo: "Trabajo Semana 1 - Fundamentos de arquitectura",
            desc: "Mapa conceptual de fundamentos de arquitectura de software.",
            pdf: "PDF/Fundamentos_de_Software.pdf"
        },
        2: {
            titulo: "Trabajo Semana 2 - MVC",
            desc: "Explicación y ejemplo práctico del patrón MVC.",
            pdf: "PDF/Arquitectura_Semana2.pdf"
        }
    }
};

// =================== Eventos ===================

// Abrir curso → ver semanas
document.querySelectorAll(".curso-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        cursoActual = btn.dataset.curso;
        cursoTitle.textContent = "Semanas de " + cursoActual;

        // Generar dinámicamente las tarjetas de semanas
        const contenedor = document.querySelector("#semanas-container");
        contenedor.innerHTML = "";

        if (semanas[cursoActual]) {
            Object.entries(semanas[cursoActual]).forEach(([num, data]) => {
                contenedor.innerHTML += `
                    <div class="mix semana">
                        <article class="work-card">
                            <img src="img/news4.jpg" alt="" class="work-img" />
                            <h4 class="work-category">Semana ${num}</h4>
                            <h3 class="work-title">${data.titulo}</h3>
                            <p class="work-description">${data.desc}</p>
                            <a href="#" class="work-link semana-btn" data-semana="${num}">
                                Ver Trabajo <i class="ri-arrow-right-fill work-icon"></i>
                            </a>
                        </article>
                    </div>
                `;
            });

            // Reasignar eventos a los botones de semanas generados
            document.querySelectorAll(".semana-btn").forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    const semanaId = btn.dataset.semana;

                    if (trabajos[cursoActual] && trabajos[cursoActual][semanaId]) {
                        const data = trabajos[cursoActual][semanaId];
                        trabajoTitle.textContent = data.titulo;
                        trabajoDesc.textContent = data.desc;
                        trabajoPdf.src = data.pdf;
                        trabajoDownload.href = data.pdf;
                    } else {
                        trabajoTitle.textContent = "Trabajo no disponible";
                        trabajoDesc.textContent = "Todavía no se ha subido el trabajo para esta semana.";
                        trabajoPdf.src = "";
                        trabajoDownload.removeAttribute("href");
                    }

                    semanasView.classList.add("hidden");
                    trabajoView.classList.remove("hidden");
                });
            });
        }

        cursosView.classList.add("hidden");
        semanasView.classList.remove("hidden");
    });
});

// Volver a semanas
volverSemanas.addEventListener("click", e => {
    e.preventDefault();
    trabajoView.classList.add("hidden");
    semanasView.classList.remove("hidden");
});

// Volver a cursos
volverCursos.addEventListener("click", e => {
    e.preventDefault();
    semanasView.classList.add("hidden");
    cursosView.classList.remove("hidden");
});


/*=========================FIN DE PRUEBA=============================*/