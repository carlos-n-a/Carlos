/*Cambiar el encabezado de fondo*/
const scrollHeader = () => {
    const header = document.getElementById('header');

    this.scrollY >= 20 
        ? header.classList.add('scroll-header')
        : header.classList.remove('scroll-header');
};

window.addEventListener('scroll', scrollHeader);

/*Animación de secciones de desplazamiento*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop -58,
            sectionId = current.getAttribute('id'),
            sectionClass = document.querySelector(
                '.nav-menu a[href*=' + sectionId + ']'
        );

        
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            sectionClass.classList.add('active-link');
        } else {
            sectionClass.classList.remove('active-link');
        }
    });
};

window.addEventListener('scroll', scrollActive)

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
        target: '.mix',
    },
    animation: {
        duration: 300,
    },
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

/*Prueba*/

