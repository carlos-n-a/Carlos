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

/*ADMINISTRADOR*/

document.addEventListener("DOMContentLoaded", async () => {
  // Inicializar Supabase
  const { createClient } = supabase;
  const supabaseUrl = "https://qvsejpkuukirlliqvesw.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2c2VqcGt1dWtpcmxsaXF2ZXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODI0ODksImV4cCI6MjA3NDk1ODQ4OX0.AWQGiz5a4Vqu-7Cw3AA9HfVRTac0xs9EZQ20RPVKuQs";
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const adminLink = document.getElementById('admin-link');
  const logoutItem = document.getElementById('logout-item');
  const modal = document.getElementById('login-modal');
  const closeBtn = document.querySelector('.modal-admi .close');
  const loginForm = modal.querySelector('form');
  const adminActions = document.querySelector('.admin-actions');

  // Mostrar modal
  if (adminLink) {
    adminLink.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });
  }

  // Cerrar modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // LOGIN SUPABASE
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = loginForm.querySelector('input[type="text"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        alert("❌ " + error.message);
      } else {
        alert("✅ Sesión iniciada correctamente");
        modal.style.display = 'none';
        localStorage.setItem("isLoggedIn", "true");
        if (adminLink) adminLink.style.display = "none";
        if (logoutItem) logoutItem.style.display = "block";
        window.location.reload();
      }
    });
  }

  // LOGOUT
  if (logoutItem) {
    logoutItem.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabaseClient.auth.signOut();
      localStorage.removeItem("isLoggedIn");
      alert("👋 Sesión cerrada");
      if (adminLink) adminLink.style.display = "block";
      if (logoutItem) logoutItem.style.display = "none";
      if (adminActions) adminActions.style.display = "none";
      window.location.reload();
    });
  }

  // VERIFICAR SESIÓN
  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    console.log("✅ Usuario logueado");
    if (adminLink) adminLink.style.display = "none";
    if (logoutItem) logoutItem.style.display = "block";
    if (adminActions) adminActions.style.display = "block";
  } else {
    console.log("🚫 No hay sesión");
    if (adminLink) adminLink.style.display = "block";
    if (logoutItem) logoutItem.style.display = "none";
    if (adminActions) adminActions.style.display = "none";
  }
});
