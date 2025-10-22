/* ==================== CAMBIO DE COLOR DE HEADER ==================== */
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (!header) return;
  if (window.scrollY >= 20) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
});

/* ==================== FUNCIONALIDAD DE ACORDEONES + SUPABASE ==================== */
document.addEventListener("DOMContentLoaded", async () => {
  /* ---------- INICIALIZACIÓN ---------- */
  const supabaseUrl = "https://qvsejpkuukirlliqvesw.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2c2VqcGt1dWtpcmxsaXF2ZXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODI0ODksImV4cCI6MjA3NDk1ODQ4OX0.AWQGiz5a4Vqu-7Cw3AA9HfVRTac0xs9EZQ20RPVKuQs";
  const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

  /* ---------- LOGIN Y SESIÓN ---------- */
  const adminLink = document.getElementById("admin-link");
  const logoutItem = document.getElementById("logout-item");
  const modal = document.getElementById("login-modal");
  const closeBtn = document.querySelector(".modal-admi .close");
  const loginForm = modal?.querySelector("form");
  const adminActions = document.querySelector(".admin-actions");

  // Mostrar modal
  adminLink?.addEventListener("click", (e) => {
    e.preventDefault();
    if (modal) modal.style.display = "flex";
  });

  // Cerrar modal
  closeBtn?.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // LOGIN
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) return alert("❌ " + error.message);

    alert("✅ Sesión iniciada correctamente");
    modal.style.display = "none";
    localStorage.setItem("isLoggedIn", "true");
    adminLink.style.display = "none";
    logoutItem.style.display = "block";
    window.location.reload();
  });

  // LOGOUT
  logoutItem?.addEventListener("click", async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    localStorage.removeItem("isLoggedIn");
    alert("👋 Sesión cerrada");
    adminLink.style.display = "block";
    logoutItem.style.display = "none";
    if (adminActions) adminActions.style.display = "none";
    window.location.reload();
  });

  // Verificar sesión
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const isLoggedIn =
    !!sessionData.session || localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    adminLink.style.display = "none";
    logoutItem.style.display = "block";
    if (adminActions) adminActions.style.display = "block";
  } else {
    adminLink.style.display = "block";
    logoutItem.style.display = "none";
    if (adminActions) adminActions.style.display = "none";
  }

  /* ---------- ACORDEONES ---------- */
  document.querySelectorAll(".accordion-header .toggle-btn").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const header = toggle.closest(".accordion-header");
      const content = header.nextElementSibling;
      content.classList.toggle("open");
      header.classList.toggle("active");
    });
  });

  /* ---------- FUNCIÓN PARA CARGAR TRABAJOS ---------- */
  async function cargarTrabajos(accordion) {
    const semana = accordion.dataset.semana;
    const grid = accordion.querySelector(".trabajos-grid");
    grid.innerHTML = "<p>Cargando...</p>";

    const { data, error } = await supabaseClient
      .from("Semanas")
      .select("*")
      .eq("semana", semana);

    if (error) {
      console.error("Error al cargar trabajos:", error);
      grid.innerHTML = "<p>Error al cargar trabajos.</p>";
      return;
    }

    if (!data || data.length === 0) {
      grid.innerHTML = "<p>No hay trabajos aún.</p>";
      return;
    }

    grid.innerHTML = "";
    data.forEach((trabajo) => {
      const card = document.createElement("div");
      card.classList.add("card-trabajo");
      card.dataset.url = trabajo.url;
      card.innerHTML = `
        <embed src="${trabajo.url}" type="application/pdf" width="100%" height="200px" />
        <div class="card-botones">
          <a href="${trabajo.url}" target="_blank" class="trabajo-btn btn-ver">👁 Ver</a>
          <a href="${trabajo.url}" download class="trabajo-btn btn-descargar">⬇ Descargar</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ---------- CONFIGURAR CADA SEMANA ---------- */
  document.querySelectorAll(".accordion").forEach((accordion) => {
    const btnEliminar = accordion.querySelector(".btn-admin.eliminar");
    const btnAgregar = accordion.querySelector(".btn-admin.agregar");
    const grid = accordion.querySelector(".trabajos-grid");
    const accionesAdmin = accordion.querySelector(".acciones-admin");
    const content = accordion.querySelector(".accordion-content");
    let modoEliminar = false;

    if (accionesAdmin) accionesAdmin.style.display = "none";

    // Mostrar acciones solo si está logueado
    if (isLoggedIn && accionesAdmin) {
      const observer = new MutationObserver(() => {
        accionesAdmin.style.display = content.classList.contains("open")
          ? "flex"
          : "none";
      });
      observer.observe(content, { attributes: true, attributeFilter: ["class"] });
    }

    // Cargar trabajos al abrir
    accordion.querySelector(".accordion-header").addEventListener("click", () => {
      if (!content.classList.contains("loaded")) {
        cargarTrabajos(accordion);
        content.classList.add("loaded");
      }
    });

    /* ---------- AGREGAR TRABAJO ---------- */
btnAgregar?.addEventListener("click", async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,.docx,.jpg,.png";
  input.click();

  input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1️⃣ Limpiar nombre del archivo
    const sanitizedName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_.-]/g, "_");

    // 2️⃣ Obtener el nombre de semana tal cual está en el HTML
    const semana = accordion.dataset.semana;

    // 3️⃣ Crear ruta para el archivo (con guion bajo solo en carpeta del storage)
    const filePath = `${semana.replace(/\s+/g, "_")}/${Date.now()}_${sanitizedName}`;

    // 4️⃣ Subir archivo a Supabase Storage
    const { error: uploadError } = await supabaseClient.storage
      .from("trabajos")
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      alert("❌ Error al subir el archivo al Storage.");
      console.error(uploadError);
      return;
    }

    // 5️⃣ Obtener la URL pública
    const { data: publicData } = supabaseClient.storage
      .from("trabajos")
      .getPublicUrl(filePath);
    const url = publicData.publicUrl;

    // 6️⃣ Guardar en la tabla Semanas con el nombre correcto
    const { error: dbError } = await supabaseClient
      .from("Semanas")
      .insert([{ titulo: sanitizedName, url, semana }]);

    if (dbError) {
      alert("❌ Error al guardar en la base de datos.");
      console.error(dbError);
      await supabaseClient.storage.from("trabajos").remove([filePath]);
      return;
    }

    // 7️⃣ Mostrar la nueva tarjeta sin recargar
// Eliminar mensaje "No hay trabajos aún." si existe
if (grid.textContent.trim() === "No hay trabajos aún.") grid.innerHTML = "";

const card = document.createElement("div");
card.classList.add("card-trabajo");
card.dataset.url = url;
card.innerHTML = `
  <embed src="${url}" type="application/pdf" width="100%" height="200px" />
  <div class="card-botones">
    <a href="${url}" target="_blank" class="trabajo-btn btn-ver">👁 Ver</a>
    <a href="${url}" download class="trabajo-btn btn-descargar">⬇ Descargar</a>
  </div>
`;
grid.appendChild(card);

alert("✅ Trabajo agregado correctamente y mostrado en la página.");
  });
});
    /* ---------- ELIMINAR TRABAJO ---------- */
btnEliminar?.addEventListener("click", async () => {
  const trabajos = grid.querySelectorAll(".card-trabajo");

  // 🟢 Primera pulsación: activar modo eliminar
  if (!modoEliminar) {
    modoEliminar = true;
    btnEliminar.textContent = "CONFIRMAR ELIMINAR";

    trabajos.forEach((trabajo) => {
      if (!trabajo.querySelector(".check-eliminar")) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("check-eliminar");
        trabajo.style.position = "relative";
        checkbox.style.position = "absolute";
        checkbox.style.top = "8px";
        checkbox.style.right = "8px";
        trabajo.appendChild(checkbox);
      }
    });

    alert("Selecciona los trabajos que deseas eliminar y vuelve a presionar el botón.");
    return;
  }

  // 🟡 Segunda pulsación: confirmar eliminación
  const seleccionados = grid.querySelectorAll(".check-eliminar:checked");

  // Si no seleccionó ninguno
  if (seleccionados.length === 0) {
    alert("⚠ No seleccionaste ningún trabajo para eliminar.");
    // 🔄 Volvemos al modo normal
    grid.querySelectorAll(".check-eliminar").forEach((chk) => chk.remove());
    modoEliminar = false;
    btnEliminar.textContent = "ELIMINAR";
    return;
  }

  // 🧩 Confirmar eliminación
  const confirmar = confirm(`¿Seguro que quieres eliminar ${seleccionados.length} trabajo(s)?`);
  if (!confirmar) {
    // ❌ Cancelado → se limpian los checkboxes
    grid.querySelectorAll(".check-eliminar").forEach((chk) => chk.remove());
    modoEliminar = false;
    btnEliminar.textContent = "ELIMINAR";
    return;
  }

  // 🧹 Eliminar los seleccionados
  for (const chk of seleccionados) {
    const card = chk.closest(".card-trabajo");
    const url = card.querySelector("embed").src;

    // Obtener ruta del archivo en el storage
    const match = url.match(/\/storage\/v1\/object\/public\/trabajos\/(.+)$/);
    const filePath = match && match[1] ? decodeURIComponent(match[1]) : null;

    if (filePath) {
      await supabaseClient.storage.from("trabajos").remove([filePath]);
    }

    await supabaseClient.from("Semanas").delete().eq("url", url);
    card.remove();
  }

  alert("🗑 Trabajos eliminados correctamente.");

  // 🔄 Reset
  grid.querySelectorAll(".check-eliminar").forEach((chk) => chk.remove());
  modoEliminar = false;
  btnEliminar.textContent = "ELIMINAR";
});

  });
});
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-descargar")) {
    e.preventDefault();

    const url = e.target.getAttribute("href");
    const nombre = url.split("/").pop().split("?")[0]; // nombre del archivo

    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombre;
    link.click();

    URL.revokeObjectURL(link.href);
  }
});
