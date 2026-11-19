import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  Wrench,
  UserRound,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Star,
  MapPin,
  BadgeCheck,
  Search,
  Bell
} from "lucide-react";
import "./index.css";

function App() {
const [pantalla, setPantalla] = useState("inicio");
const [solicitudIdActual, setSolicitudIdActual] = useState(null);

const [misSolicitudes, setMisSolicitudes] = useState([]);
const [cargandoMisSolicitudes, setCargandoMisSolicitudes] = useState(false);
const [mensajeMisSolicitudes, setMensajeMisSolicitudes] = useState("");

  // Recuperación de contraseña
const [correoRecuperacion, setCorreoRecuperacion] = useState("");
const [nuevaPassword, setNuevaPassword] = useState("");
const [confirmarPassword, setConfirmarPassword] = useState("");
const [mensajeRecuperacion, setMensajeRecuperacion] = useState("");
const [cargandoRecuperacion, setCargandoRecuperacion] = useState(false);
const [tipoUsuario, setTipoUsuario] = useState("");
const [datos, setDatos] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    localidad: "",
    servicios: "",
    experiencia: "",
    password: "",
    confirmarPassword: ""
  });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null); /*recuerde qué profesional seleccionó el cliente. */
  const [loginData, setLoginData] = useState({
  correo: "",
  password: ""
});

const [perfilTrabajador, setPerfilTrabajador] = useState({
  nombre: "",
  telefono: "",
  localidad: "",
  experiencia: "",
  descripcion: ""
});
const [fotoTrabajador, setFotoTrabajador] = useState("");
const [archivoFoto, setArchivoFoto] = useState(null);
const [cargandoFoto, setCargandoFoto] = useState(false);
const [mensajePerfil, setMensajePerfil] = useState("");


const [serviciosTrabajador, setServiciosTrabajador] = useState([]);
const [profesionalesReales, setProfesionalesReales] = useState([]);
const [cargandoProfesionales, setCargandoProfesionales] = useState(false);
const [nuevoServicio, setNuevoServicio] = useState({
  categoria: "",
  nombre: "",
  descripcion: ""
});
const [mensajeServicio, setMensajeServicio] = useState("");
const [cargandoServicios, setCargandoServicios] = useState(false);

useEffect(() => {
  if (pantalla === "serviciosTrabajador") {
    cargarServiciosTrabajador();
  }
}, [pantalla]);
  const profesionalesDemo = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    servicio: "Plomero general",
    categoria: "Plomería",
    calificacion: "4.9",
    resenas: 87,
    ubicacion: "Galán - Bogotá",
    distancia: "0.4 km",
    tarifa: "$6.500 / metro",
    disponible: true,
    verificado: true,
    experiencia: "12 años de experiencia en reparaciones domiciliarias. Trabajo rápido, responsable y garantizado.",
    serviciosDetalle: [
    "Instalaciones",
    "Reparación de cañerías",
    "Destapaciones",
    "Termotanques"
    ]
  },
  {
    id: 2,
    nombre: "Javier Torres",
    servicio: "Pintor y empapelador",
    categoria: "Carpintería",
    calificacion: "4.7",
    resenas: 132,
    ubicacion: "Primavera - Bogotá",
    distancia: "1.4 km",
    tarifa: "$7.500 / metro",
    disponible: false,
    verificado: true,experiencia: "Especialista en pintura y acabados para interiores y exteriores.",
    serviciosDetalle: [
      "Pintura interior",
      "Pintura exterior",
      "Acabados",
      "Empapelado"
    ]
  },
  {
    id: 3,
    nombre: "Andrés Ramírez",
    servicio: "Electricista",
    categoria: "Electricidad",
    calificacion: "4.8",
    resenas: 64,
    ubicacion: "Bogotá",
    distancia: "1.2 km",
    tarifa: "Consultar tarifa",
    disponible: true,
    verificado: false,
    experiencia: "Electricista independiente con experiencia en instalaciones y mantenimiento.",
    serviciosDetalle: [
      "Instalaciones eléctricas",
      "Reparaciones",
      "Iluminación",
      "Mantenimiento"
    ]
  },
  {
    id:4,
    nombre: "Carmen Rodriguez",
    servicio: "Aseo general",
    categoria: "Aseo",
    calificacion: "4.8",
    resenas: 55,
    ubicacion: "Bogotá",
    distancia: "1.3 km",
    tarifa: "Consultar tarifa",
    disponible: true,
    verificado: false,
    experiencia: "Persona responsable y honesta con experiencia en el mantenimiento integral del hogar, limpieza profunda, lavado, planchado y preparación de alimentos. Capacidad para organizar tareas diarias de forma autónoma y discreta.",
    serviciosDetalle: [
      "Limpieza y desinfección profunda",
      "Lavado y planchado",
      "Cocina básica o tradicional",
    ]
  }
];

const profesionalesFiltrados =
  categoriaActiva === "Todos"
    ? profesionalesReales
    : profesionalesReales.filter(
        (profesional) => profesional.categoria === categoriaActiva
      );
      const [solicitud, setSolicitud] = useState({
        descripcion: "",
        direccion: "",
        urgente: false
      });

      const [erroresSolicitud, setErroresSolicitud] = useState({});
      const [solicitudCreada, setSolicitudCreada] = useState(false);

      // SOLICITUDES RECIBIDAS POR EL TRABAJADOR
      const [solicitudesTrabajador, setSolicitudesTrabajador] = useState([]);
      const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);
      const [mensajeSolicitudes, setMensajeSolicitudes] = useState("");
function actualizarSolicitud(evento) {
  const { name, value, type, checked } = evento.target;

  setSolicitud((anterior) => ({
    ...anterior,
    [name]: type === "checkbox" ? checked : value
  }));

  setErroresSolicitud((anterior) => ({
    ...anterior,
    [name]: ""
  }));
}

async function enviarSolicitud(evento) {
  evento.preventDefault();

  const nuevosErrores = {};

  if (!solicitud.descripcion.trim()) {
    nuevosErrores.descripcion =
      "Describe el trabajo que necesitas realizar.";
  }

  if (!solicitud.direccion.trim()) {
    nuevosErrores.direccion =
      "Escribe la dirección o ubicación del servicio.";
  }

  setErroresSolicitud(nuevosErrores);

  if (Object.keys(nuevosErrores).length > 0) {
    return;
  }

  try {
    setMensaje("Enviando solicitud...");

    const { data: usuarioData, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    const usuario = usuarioData.user;

    if (!usuario) {
      throw new Error("Debes iniciar sesión para solicitar un servicio.");
    }

    if (!profesionalSeleccionado?.worker_id) {
  throw new Error(
    "No se pudo identificar al trabajador. Regresa al catálogo y selecciona nuevamente al profesional."
  );
}
console.log("USUARIO CLIENTE:", usuario.id);
console.log("PROFESIONAL SELECCIONADO:", profesionalSeleccionado);
console.log("ID DEL TRABAJADOR:", profesionalSeleccionado?.worker_id);

    const { data: solicitudGuardada, error } = await supabase
      .from("service_requests")
      .insert({
        client_id: usuario.id,
        worker_id: profesionalSeleccionado.worker_id,
        description: solicitud.descripcion.trim(),
        service_address: solicitud.direccion.trim(),
        urgent: solicitud.urgente,
        status: "pending"
      })
       .select("id")
  .single();

if (error) throw error;

setSolicitudIdActual(solicitudGuardada.id);

    if (error) throw error;

    setSolicitudCreada(true);
    setMensaje(
      "¡Solicitud enviada! El trabajador podrá revisarla y responder."
    );
    setPantalla("confirmacion");

  } catch (error) {
    console.error("Error enviando solicitud:", error);
    setMensaje(
      "No fue posible enviar la solicitud: " + error.message
    );
  }
}

async function cargarSolicitudesTrabajador() {
  setCargandoSolicitudes(true);
  setMensajeSolicitudes("");

  try {
    const {
      data: { user },
      error: errorUsuario
    } = await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    if (!user) {
      setMensajeSolicitudes("Debes iniciar sesión para consultar tus solicitudes.");
      return;
    }

    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .eq("worker_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    setSolicitudesTrabajador(data || []);

  } catch (error) {
    console.error("Error consultando solicitudes:", error);
    setMensajeSolicitudes("No fue posible cargar las solicitudes.");
  } finally {
    setCargandoSolicitudes(false);
  }
}

async function responderSolicitud(solicitudId, nuevoEstado) {
  try {
    setMensajeSolicitudes("");

    const {
      data: { user },
      error: errorUsuario
    } = await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    if (!user) {
      setMensajeSolicitudes("Debes iniciar sesión.");
      return;
    }

    const { error } = await supabase
      .from("service_requests")
      .update({ status: nuevoEstado })
      .eq("id", solicitudId)
      .eq("worker_id", user.id);

    if (error) throw error;

    setSolicitudesTrabajador((solicitudesActuales) =>
      solicitudesActuales.map((item) =>
        item.id === solicitudId
          ? { ...item, status: nuevoEstado }
          : item
      )
    );

    setMensajeSolicitudes(
      nuevoEstado === "accepted"
        ? "¡Has aceptado el servicio correctamente!"
        : "Has rechazado la solicitud."
    );

  } catch (error) {
    console.error("Error al responder la solicitud:", error);
    setMensajeSolicitudes(
      "No fue posible actualizar la solicitud. Inténtalo nuevamente."
    );
  }
}

  function abrirRegistro(tipo) {
    setTipoUsuario(tipo);
    setDatos({
      nombre: "",
      correo: "",
      telefono: "",
      localidad: "",
      servicios: "",
      experiencia: "",
      password: "",
      confirmarPassword: ""
    });
    setErrores({});
    setMensaje("");
    setPantalla("registro");
  }

  function actualizarCampo(evento) {
    const { name, value } = evento.target;
    setDatos((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value
    }));
    setErrores((erroresAnteriores) => ({
      ...erroresAnteriores,
      [name]: ""
    }));
  }
function actualizarPerfil(evento) {
  const { name, value } = evento.target;

  setPerfilTrabajador((anterior) => ({
    ...anterior,
    [name]: value
  }));

  setMensajePerfil("");
}

async function guardarPerfilTrabajador(evento) {
  evento.preventDefault();
  setMensajePerfil("Guardando tus datos...");

  try {
    const { data: usuarioData, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    const usuario = usuarioData.user;

    if (!usuario) {
      throw new Error("No hay una sesión activa.");
    }

    const { error: errorPerfil } = await supabase
      .from("profiles")
      .update({
        full_name: perfilTrabajador.nombre.trim(),
        phone: perfilTrabajador.telefono.trim(),
        locality: perfilTrabajador.localidad.trim()
      })
      .eq("id", usuario.id);

    if (errorPerfil) throw errorPerfil;

    const { data: perfilExistente, error: errorConsulta } =
      await supabase
        .from("worker_public_profiles")
        .select("user_id, photo_url")
        .eq("user_id", usuario.id)
        .maybeSingle();

    if (errorConsulta) throw errorConsulta;

   // Primero conservamos la fotografía que ya estaba guardada.
let fotoUrl = perfilExistente?.photo_url || "";

// Si seleccionaste una fotografía nueva, la subimos a Supabase.
if (archivoFoto) {
  setCargandoFoto(true);

  const nombreArchivo =
    `${usuario.id}/${Date.now()}-${archivoFoto.name}`;

  const { error: errorFoto } = await supabase.storage
    .from("fotos-trabajadores")
    .upload(nombreArchivo, archivoFoto, {
      cacheControl: "3600",
      upsert: false,
      contentType: archivoFoto.type
    });

  if (errorFoto) throw errorFoto;

  const { data: urlFoto } = supabase.storage
    .from("fotos-trabajadores")
    .getPublicUrl(nombreArchivo);

  fotoUrl = urlFoto.publicUrl;
}

// Ahora sí construimos los datos del perfil con la URL disponible.
const datosPublicos = {
  user_id: usuario.id,
  public_name: perfilTrabajador.nombre.trim(),
  locality: perfilTrabajador.localidad.trim(),
  bio: perfilTrabajador.descripcion.trim(),
  experience_years: Number(perfilTrabajador.experiencia) || 0,
  photo_url: fotoUrl
};

    const resultado = perfilExistente
      ? await supabase
          .from("worker_public_profiles")
          .update(datosPublicos)
          .eq("user_id", usuario.id)
      : await supabase
          .from("worker_public_profiles")
          .insert(datosPublicos);

    if (resultado.error) throw resultado.error;

    setMensajePerfil("¡Tu perfil se guardó correctamente!");
    setArchivoFoto(null);
    setFotoTrabajador(fotoUrl);
    setCargandoFoto(false);
  } catch (error) {
  console.error("ERROR AL GUARDAR PERFIL:", error);

  setCargandoFoto(false);

  setMensajePerfil(
    "Error al guardar: " + (error.message || "No se pudo completar la operación.")
  );
}
}

async function cargarServiciosTrabajador() {
  setCargandoServicios(true);

  try {
    const { data: usuarioData, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    const usuario = usuarioData.user;
    if (!usuario) throw new Error("No hay sesión activa.");

    const { data, error } = await supabase
      .from("worker_services")
      .select("*")
      .eq("worker_id", usuario.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    setServiciosTrabajador(data || []);
  } catch (error) {
    console.error("Error consultando servicios:", error);
    setMensajeServicio("No fue posible cargar tus servicios.");
  } finally {
    setCargandoServicios(false);
  }
}

async function cargarProfesionalesReales() {
  setCargandoProfesionales(true);

  try {
    const { data: servicios, error } = await supabase
      .from("worker_services")
      .select(`
        id,
        worker_id,
        category,
        service_name,
        description,
        active
      `)
      .eq("active", true);

    if (error) throw error;

    if (!servicios || servicios.length === 0) {
      setProfesionalesReales([]);
      return;
    }

    const idsTrabajadores = [
      ...new Set(servicios.map((s) => s.worker_id))
    ];

    const { data: perfiles, error: errorPerfiles } =
      await supabase
        .from("worker_public_profiles")
        .select("user_id, public_name, locality, bio, experience_years, photo_url")
        .in("user_id", idsTrabajadores);

    if (errorPerfiles) throw errorPerfiles;

    const trabajadores = perfiles || [];

    const resultado = servicios.map((servicio) => {
      const perfil = trabajadores.find(
        (p) => p.user_id === servicio.worker_id
      );

      return {
        id: servicio.id,
        worker_id: servicio.worker_id,
        nombre: perfil?.public_name || "Profesional SOLUCIONA",
        foto: perfil?.photo_url || "",
        servicio: servicio.service_name,
        categoria: servicio.category,
        experiencia: perfil?.bio || servicio.description || "",
        aniosExperiencia: perfil?.experience_years ?? null,
        ubicacion: perfil?.locality || "Bogotá",
        disponible: true,
        verificado: false,
        calificacion: "Nuevo",
        resenas: 0,
        distancia: "",
        tarifa: "Consultar tarifa",
        serviciosDetalle: [servicio.service_name]

      };
    });

    setProfesionalesReales(resultado);

  } catch (error) {
    console.error("Error cargando profesionales:", error);
    setMensaje("No fue posible cargar los profesionales.");
  } finally {
    setCargandoProfesionales(false);
  }
}
useEffect(() => {
  if (pantalla === "catalogo") {
    cargarProfesionalesReales();
  }
}, [pantalla]);

async function cargarMisSolicitudes() {
  setCargandoMisSolicitudes(true);
  setMensajeMisSolicitudes("");

  try {
    const { data: usuarioData, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    const usuario = usuarioData.user;

    if (!usuario) {
      setMensajeMisSolicitudes("Debes iniciar sesión para consultar tus solicitudes.");
      return;
    }

    const { data, error } = await supabase
      .from("service_requests")
      .select("*")
      .eq("client_id", usuario.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    setMisSolicitudes(data || []);

  } catch (error) {
    console.error("Error consultando solicitudes:", error);
    setMensajeMisSolicitudes("No fue posible cargar tus solicitudes.");
  } finally {
    setCargandoMisSolicitudes(false);
  }
}
async function guardarNuevoServicio(evento) {
  evento.preventDefault();
  setMensajeServicio("");

  if (
    !nuevoServicio.categoria ||
    !nuevoServicio.nombre.trim() ||
    !nuevoServicio.descripcion.trim()
  ) {
    setMensajeServicio("Completa todos los campos.");
    return;
  }

  try {
    const { data: usuarioData, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    const usuario = usuarioData.user;
    if (!usuario) throw new Error("No hay sesión activa.");

    const { data, error } = await supabase
      .from("worker_services")
      .insert({
        worker_id: usuario.id,
        category: nuevoServicio.categoria,
        service_name: nuevoServicio.nombre.trim(),
        description: nuevoServicio.descripcion.trim(),
        active: true
      })
      .select()
      .single();

    if (error) throw error;

    setServiciosTrabajador((anteriores) => [
      data,
      ...anteriores
    ]);

    setNuevoServicio({
      categoria: "",
      nombre: "",
      descripcion: ""
    });

    setMensajeServicio("¡Servicio guardado correctamente!");
  } catch (error) {
    console.error("Error guardando servicio:", error);
    setMensajeServicio(
      "No se pudo guardar el servicio. Revisa la configuración de la tabla."
    );
  }
}

async function cambiarEstadoServicio(servicio) {
  try {
    const nuevoEstado = !servicio.active;

    const { error } = await supabase
      .from("worker_services")
      .update({ active: nuevoEstado })
      .eq("id", servicio.id);

    if (error) throw error;

    setServiciosTrabajador((anteriores) =>
      anteriores.map((item) =>
        item.id === servicio.id
          ? { ...item, active: nuevoEstado }
          : item
      )
    );

    setMensajeServicio(
      nuevoEstado
        ? "Servicio activado correctamente."
        : "Servicio desactivado correctamente."
    );

  } catch (error) {
    console.error("Error cambiando el estado:", error);
    setMensajeServicio("No fue posible actualizar el servicio.");
  }
}

async function eliminarServicio(servicio) {
  const confirmar = window.confirm(
    `¿Estás seguro de eliminar "${servicio.service_name}"?`
  );

  if (!confirmar) return;

  try {
    const { data: usuarioData, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario) throw errorUsuario;

    const usuario = usuarioData.user;

    if (!usuario) {
      throw new Error("No hay una sesión activa.");
    }

    const { error } = await supabase
      .from("worker_services")
      .delete()
      .eq("id", servicio.id)
      .eq("worker_id", usuario.id);

    if (error) throw error;

    setServiciosTrabajador((anteriores) =>
      anteriores.filter((item) => item.id !== servicio.id)
    );

    setMensajeServicio("Servicio eliminado correctamente.");

  } catch (error) {
    console.error("Error eliminando servicio:", error);
    setMensajeServicio("No fue posible eliminar el servicio.");
  }
}

async function validarFormulario(evento) {
  evento.preventDefault();

  const nuevosErrores = {};

  if (!datos.nombre.trim()) {
    nuevosErrores.nombre = "Escribe tu nombre completo.";
  }

  if (!datos.correo.trim()) {
  nuevosErrores.correo = "Escribe tu correo electrónico.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())
  ) {
    nuevosErrores.correo = "Escribe un correo electrónico válido.";
  }
  
  if (!datos.telefono.trim()) {
    nuevosErrores.telefono = "Escribe tu número de celular.";
  }

  if (tipoUsuario === "cliente" && !datos.localidad.trim()) {
    nuevosErrores.localidad = "Escribe tu localidad.";
  }

  if (tipoUsuario === "trabajador" && !datos.servicios.trim()) {
    nuevosErrores.servicios = "Indica qué servicios ofreces.";
  }

  if (tipoUsuario === "trabajador" && !datos.experiencia.trim()) {
    nuevosErrores.experiencia = "Indica tu experiencia.";
  }

  if (datos.password.length < 8) {
    nuevosErrores.password =
      "La contraseña debe tener mínimo 8 caracteres.";
  }

  if (datos.confirmarPassword !== datos.password) {
    nuevosErrores.confirmarPassword =
      "Las contraseñas no coinciden.";
  }

  setErrores(nuevosErrores);

  if (Object.keys(nuevosErrores).length > 0) {
    setMensaje("Revisa los campos señalados para continuar.");
    return;
  }

  setMensaje("Registrando tu cuenta...");

  try {
  
  const { data, error } = await supabase.auth.signUp({
    email: datos.correo.trim(),
    password: datos.password,
    options: {
      data: {
        full_name: datos.nombre.trim(),
        phone: datos.telefono.trim(),
        role: tipoUsuario === "cliente" ? "client" : "worker",
        locality: datos.localidad.trim() || null
      }
    }
  }); 

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    console.error("ERROR SUPABASE:", error);
    alert(error.message);
    setMensaje("No fue posible crear la cuenta: " + error.message);
    return;
  }

  if (data.user && data.user.identities?.length === 0) {
  setMensaje(
    "Este correo ya está registrado. Intenta iniciar sesión."
  );
  return;
}

if (data.user && !data.session) {
  setMensaje(
    "Tu cuenta fue creada. Revisa tu correo electrónico y confirma tu dirección para activar tu cuenta."
  );

  setPantalla("confirmarCorreo");
  return;
}

if (data.user && data.session) {
  setMensaje("¡Registro exitoso! Bienvenido a SOLUCIONA.");
  setPantalla("catalogo");
  return;
}

  } catch (error) {
  console.error("ERROR COMPLETO:", error);
  alert(JSON.stringify(error));
  setMensaje(
    "Ocurrió un error al registrar tu cuenta. Inténtalo nuevamente."
  );
}
} 

async function iniciarSesion(evento) {
  evento.preventDefault();

  if (!loginData.correo.trim() || !loginData.password) {
    setMensaje("Escribe tu correo y contraseña para ingresar.");
    return;
  }

  setMensaje("Verificando tus datos...");

  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: loginData.correo.trim(),
        password: loginData.password
      });

    if (error) {
      if (
        error.message.toLowerCase().includes("email not confirmed")
      ) {
        setMensaje(
          "Debes confirmar tu correo electrónico antes de ingresar. Revisa tu bandeja de entrada."
        );
      } else {
        setMensaje(
          "No fue posible ingresar. Verifica tu correo y contraseña."
        );
      }
      return;
    }

    if (!data.user || !data.user.email_confirmed_at) {
      setMensaje(
        "Debes confirmar tu correo antes de utilizar SOLUCIONA."
      );
      return;
    }

    const { data: perfilCuenta, error: errorCuenta } =
      await supabase
        .from("profiles")
        .select("full_name, phone, locality, role")
        .eq("id", data.user.id)
        .maybeSingle();

    if (errorCuenta) {
      console.error("Error consultando el perfil:", errorCuenta);
    }

    const rolUsuario =
      perfilCuenta?.role ||
      data.user.user_metadata?.role ||
      "";

    const rolNormalizado = rolUsuario.toLowerCase();

    if (["worker", "trabajador"].includes(rolNormalizado)) {
      const { data: perfilPublico, error: errorPublico } =
        await supabase
          .from("worker_public_profiles")
          .select("public_name, locality, bio, experience_years, photo_url")
          .eq("user_id", data.user.id)
          .maybeSingle();

      if (errorPublico) {
        console.error(
          "Error consultando perfil profesional:",
          errorPublico
        );
      }

      setPerfilTrabajador({
        nombre:
          perfilCuenta?.full_name ||
          perfilPublico?.public_name ||
          "",
        telefono: perfilCuenta?.phone || "",
        localidad:
          perfilPublico?.locality ||
          perfilCuenta?.locality ||
          "",
        experiencia:
          perfilPublico?.experience_years != null
            ? String(perfilPublico.experience_years)
            : "",
        descripcion: perfilPublico?.bio || ""
      });

      setFotoTrabajador(perfilPublico?.photo_url || "");
      setArchivoFoto(null);
      setMensaje("¡Bienvenido a tu espacio profesional!");
      setPantalla("panelTrabajador");

    } else if (["client", "cliente"].includes(rolNormalizado)) {
      setMensaje("¡Bienvenido nuevamente a SOLUCIONA!");
      setPantalla("catalogo");

    } else {
      setMensaje(
        "No pudimos identificar el tipo de cuenta. Verifica el rol de tu perfil."
      );
    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    setMensaje(
      "Ocurrió un problema al ingresar. Inténtalo nuevamente."
    );
  }
}

// RECUPERAR CONTRASEÑA
async function enviarCorreoRecuperacion(evento) {
  evento.preventDefault();

  if (!correoRecuperacion.trim()) {
    setMensajeRecuperacion("Escribe tu correo electrónico.");
    return;
  }

  setCargandoRecuperacion(true);
  setMensajeRecuperacion("Enviando instrucciones...");

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      correoRecuperacion.trim(),
      {
        redirectTo: window.location.origin
      }
    );

    if (error) throw error;

    setMensajeRecuperacion(
      "Si el correo está registrado, recibirás un enlace para recuperar tu contraseña. Revisa también la carpeta de correo no deseado."
    );

  } catch (error) {
    setMensajeRecuperacion(
      "No fue posible enviar el correo: " + error.message
    );
  } finally {
    setCargandoRecuperacion(false);
  }
}

// ACTUALIZAR CONTRASEÑA
async function actualizarPassword(evento) {
  evento.preventDefault();

  if (nuevaPassword.length < 6) {
    setMensajeRecuperacion(
      "La contraseña debe tener al menos 6 caracteres."
    );
    return;
  }

  if (nuevaPassword !== confirmarPassword) {
    setMensajeRecuperacion("Las contraseñas no coinciden.");
    return;
  }

  setCargandoRecuperacion(true);

  try {
    const { error } = await supabase.auth.updateUser({
      password: nuevaPassword
    });

    if (error) throw error;

    setMensajeRecuperacion(
      "¡Tu contraseña fue actualizada correctamente!"
    );

    setNuevaPassword("");
    setConfirmarPassword("");

    await supabase.auth.signOut();
    setPantalla("login");

  } catch (error) {
    setMensajeRecuperacion(
      "No fue posible cambiar la contraseña: " + error.message
    );
  } finally {
    setCargandoRecuperacion(false);
  }
}

useEffect(() => {
  if (
    pantalla !== "catalogo" &&
    pantalla !== "misSolicitudes"
  ) {
    return;
  }

  const intervalo = setInterval(() => {
    cargarMisSolicitudes();
  }, 10000);

  return () => clearInterval(intervalo);
}, [pantalla]);

useEffect(() => {
  if (pantalla === "misSolicitudes") {
    cargarMisSolicitudes();
  }
}, [pantalla]);

useEffect(() => {
  if (pantalla === "solicitudesTrabajador") {
    cargarSolicitudesTrabajador();
  }
}, [pantalla]);
useEffect(() => {
  const {
    data: { subscription }
  } = supabase.auth.onAuthStateChange((evento) => {
    if (evento === "PASSWORD_RECOVERY") {
      setMensajeRecuperacion("");
      setPantalla("nuevaPassword");
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
// AQUÍ TERMINA validarFormulario//
return (
    <main className="pagina">
      <header className="encabezado">
        <button className="logo" onClick={() => setPantalla("inicio")}>
       <img
         src="/logo-soluciona.png"
          alt="Logo SOLUCIONA"
          className="logo-imagen"
        />
      </button>
        <span className="etiqueta-header">Servicios para tu hogar</span>
      </header>

      {pantalla === "inicio" && (
        <section className="principal">
          <div className="contenido">
            <div className="etiqueta">
              <ShieldCheck size={16} />
Encuentra profesionales para tu hogar o da a conocer los servicios que ofreces.            </div>

            <h1>
              Encuentra la ayuda que necesitas,
              <span> fácil y cerca de ti.</span>
            </h1>

            <p className="descripcion">
              Conectamos clientes con profesionales independientes
              para solucionar las necesidades de tu hogar.
              Encuentra servicios de manera sencilla.
            </p>

            <h2>¿Cómo deseas ingresar?</h2>

            <div className="opciones">
              <button className="tarjeta" onClick={() => abrirRegistro("cliente")}>
                <span className="icono-tarjeta cliente"><UserRound size={30} /></span>
                <span className="texto-tarjeta">
                  <strong>Soy cliente</strong>
                  <small>Necesito encontrar un profesional.</small>
                </span>
                <ArrowRight className="flecha" size={22} />
              </button>

              <button className="tarjeta" onClick={() => abrirRegistro("trabajador")}>
                <span className="icono-tarjeta trabajador"><Wrench size={30} /></span>
                <span className="texto-tarjeta">
                  <strong>Soy trabajador</strong>
                  <small>Quiero ofrecer mis servicios.</small>
                </span>
                <ArrowRight className="flecha" size={22} />
              </button>
            </div>
            <div className="acceso-cuenta">
  <p>¿Ya tienes una cuenta en SOLUCIONA?</p>

  <button

  className="boton-principal"
  onClick={() => {
    setMensaje("");
    setLoginData({
      correo: "",
      password: ""
    });
    setPantalla("login");
  }}
>
  Iniciar sesión <ArrowRight size={18} />
</button>


</div>
<div className="beneficios">
  <span><CheckCircle2 size={17} /> Fácil de usar</span>
  <span><CheckCircle2 size={17} /> Conexión directa</span>
  <span><CheckCircle2 size={17} /> Servicios para el hogar</span>
</div>
</div>

  <div className="ilustracion">
    <div className="circulo">
    <div className="circulo-decorativo">
    <img
      src="/public/logo-soluciona-png.png" 
      alt="Logo SOLUCIONA"
      className="logo-circulo"
      />
    </div>
      <div className="burbuja burbuja-uno"><CheckCircle2 size={25} /></div>
      <div className="burbuja burbuja-dos"><ShieldCheck size={25} /></div>
    </div>
    <p>La solución que necesitas está más cerca.</p>
  </div>
  </section>
)}
{pantalla === "login" && (
  <section className="seccion-formulario">

    <button
      className="volver"
      onClick={() => {
        setMensaje("");
        setPantalla("inicio");
      }}
    >
      <ArrowLeft size={18} /> Volver al inicio
    </button>

    <div className="formulario-contenedor">

      <div className="etiqueta">
        <ShieldCheck size={16} />
        ACCESO A TU CUENTA
      </div>

      <h1 className="titulo-formulario">
        Bienvenido nuevamente
      </h1>

      <p className="descripcion">
        Ingresa tu correo electrónico y contraseña
        para continuar utilizando SOLUCIONA.
      </p>

      <form onSubmit={iniciarSesion} noValidate>

        <label>Correo electrónico *</label>

        <input
          type="email"
          name="correo"
          value={loginData.correo}
          onChange={(evento) =>
            setLoginData({
              ...loginData,
              correo: evento.target.value
            })
          }
          placeholder="ejemplo@correo.com"
          required
        />

        <label>Contraseña *</label>

        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={(evento) =>
            setLoginData({
              ...loginData,
              password: evento.target.value
            })
          }
          placeholder="Escribe tu contraseña"
          required
        />

        <div className="recuperar-enlace">
          <button
            type="button"
            onClick={() => {
              setCorreoRecuperacion(loginData.correo);
              setMensajeRecuperacion("");
              setPantalla("recuperarPassword");
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          className="boton-principal"
          type="submit"
        >
          Ingresar <ArrowRight size={18} />
        </button>

        {mensaje && (
          <div
            className="mensaje-formulario"
            role="status"
          >
            {mensaje}
          </div>
        )}

      </form>

      <p className="nota-privacidad">
        ¿Aún no tienes una cuenta?
      </p>

      <button
        className="volver-catalogo"
        onClick={() => {
          setMensaje("");
          setPantalla("inicio");
        }}
      >
        Crear una cuenta
      </button>

    </div>
  </section>
)}
{pantalla === "confirmarCorreo" && (
  
  <section className="seccion-formulario">
    <div className="formulario-contenedor">

      <div className="etiqueta">
        <ShieldCheck size={18} />
        ACTIVACIÓN DE CUENTA
      </div>

      <div className="confirmacion-icono">
        <CheckCircle2 size={48} />
      </div>

      <h1 className="titulo-formulario">
        ¡Ya casi estás listo!
      </h1>

      <p className="descripcion">
        Tu registro en SOLUCIONA fue realizado correctamente.
      </p>

      <p className="descripcion">
        Revisa tu correo electrónico y abre el enlace
        que te enviamos para confirmar tu dirección.
      </p>

      <p className="descripcion">
        Hasta que no confirmes tu correo, no podrás iniciar sesión.
      </p>

      <button
        className="boton-principal"
        onClick={() => {
          setMensaje("");
          setPantalla("inicio");
        }}
      >
        Volver al inicio
        <ArrowRight size={18} />
      </button>
      </div>
        </section>
      )}
{pantalla === "recuperarPassword" && (
  <section className="seccion-formulario">
    <button

      className="volver"
      onClick={() => {
        setMensajeRecuperacion("");
        setPantalla("login");
      }}
    >
      <ArrowLeft size={18} /> Volver al inicio de sesión
    </button>

    <div className="formulario-contenedor">
      <div className="etiqueta">
        <ShieldCheck size={16} />
        RECUPERAR CUENTA
      </div>

      <h1 className="titulo-formulario">
        ¿Olvidaste tu contraseña?
      </h1>

      <p className="descripcion">
        Escribe el correo electrónico con el que te registraste.
        Te enviaremos un enlace para crear una nueva contraseña.
      </p>

      <form onSubmit={enviarCorreoRecuperacion} noValidate>
        <label>Correo electrónico *</label>

        <input
          type="email"
          value={correoRecuperacion}
          onChange={(evento) =>
            setCorreoRecuperacion(evento.target.value)
          }
          placeholder="ejemplo@correo.com"
          required
        />

        <button
          className="boton-principal"
          type="submit"
          disabled={cargandoRecuperacion}
        >
          {cargandoRecuperacion
            ? "Enviando..."
            : "Enviar enlace de recuperación"}
        </button>

        {mensajeRecuperacion && (
          <div className="mensaje-formulario" role="status">
            {mensajeRecuperacion}
          </div>
        )}
      </form>
{pantalla === "nuevaPassword" && (
  <section className="seccion-formulario">
    <div className="formulario-contenedor">
      <div className="etiqueta">
        <ShieldCheck size={16} />
        NUEVA CONTRASEÑA
      </div>

      <h1 className="titulo-formulario">
        Crea una nueva contraseña
      </h1>

      <p className="descripcion">
        Elige una contraseña segura para continuar utilizando SOLUCIONA.
      </p>

      <form onSubmit={actualizarPassword} noValidate>
        <label>Nueva contraseña *</label>

        <input
          type="password"
          value={nuevaPassword}
          onChange={(evento) =>
            setNuevaPassword(evento.target.value)
          }
          placeholder="Mínimo 6 caracteres"
          required
        />

        <label>Confirmar contraseña *</label>

        <input
          type="password"
          value={confirmarPassword}
          onChange={(evento) =>
            setConfirmarPassword(evento.target.value)
          }
          placeholder="Escribe nuevamente tu contraseña"
          required
        />

        <button
          className="boton-principal"
          type="submit"
          disabled={cargandoRecuperacion}
        >
          {cargandoRecuperacion
            ? "Guardando..."
            : "Guardar nueva contraseña"}
        </button>

        {mensajeRecuperacion && (
          <div className="mensaje-formulario" role="status">
            {mensajeRecuperacion}
          </div>
        )}
      </form>
    </div>
  </section>
)}

    </div>
  </section>
)}
{pantalla === "registro" && (
  <section className="seccion-formulario">
    <button className="volver" onClick={() => setPantalla("inicio")}>
      <ArrowLeft size={18} /> Volver al inicio
    </button>

    <div className="formulario-contenedor">
      <div className="etiqueta">
        <ShieldCheck size={16} /> CREA TU CUENTA
      </div>

      <h1 className="titulo-formulario">
        Registro de {tipoUsuario === "cliente" ? "cliente" : "trabajador"}
      </h1>

      <p className="descripcion">
        Completa la información para comenzar a utilizar SOLUCIONA.
        Los campos marcados son obligatorios.
      </p>

      <form onSubmit={validarFormulario} noValidate>
        <label>Nombre completo *</label>
        <input
          name="nombre"
          value={datos.nombre}
          onChange={actualizarCampo}
          placeholder="Ej. Paola Fernandez"
        />
        {errores.nombre && <small className="error">{errores.nombre}</small>}

        <label>Correo electrónico *</label>
        <input
          name="correo"
          type="email"
          value={datos.correo}
          onChange={actualizarCampo}
          placeholder="jpfernandez@unadvirtual.edu.com"
        />
        {errores.correo && <small className="error">{errores.correo}</small>}

        <label>Número de celular *</label>
        <input
          name="telefono"
          type="tel"
          value={datos.telefono}
          onChange={actualizarCampo}
          placeholder="Tu número de contacto"
        />
        {errores.telefono && <small className="error">{errores.telefono}</small>}

        {tipoUsuario === "cliente" && (
          <>
            <label>Localidad *</label>
            <input
              name="localidad"
              value={datos.localidad}
              onChange={actualizarCampo}
              placeholder="Ej. Puente Aranda"
            />
            {errores.localidad && <small className="error">{errores.localidad}</small>}
          </>
        )}

        {tipoUsuario === "trabajador" && (
          <>
            <label>Servicios que ofreces *</label>
            <input
              name="servicios"
              value={datos.servicios}
              onChange={actualizarCampo}
              placeholder="Ej. Plomería, electricidad, pintura"
            />
            {errores.servicios && <small className="error">{errores.servicios}</small>}

            <label>Experiencia *</label>
            <input
              name="experiencia"
              value={datos.experiencia}
              onChange={actualizarCampo}
              placeholder="Ej. 3 años de experiencia"
            />
            {errores.experiencia && <small className="error">{errores.experiencia}</small>}
          </>
        )}

        <label>Contraseña *</label>
        <input
          name="password"
          type="password"
          value={datos.password}
          onChange={actualizarCampo}
          placeholder="Mínimo 8 caracteres"
        />
        {errores.password && <small className="error">{errores.password}</small>}

        <label>Confirmar contraseña *</label>
        <input
          name="confirmarPassword"
          type="password"
          value={datos.confirmarPassword}
          onChange={actualizarCampo}
          placeholder="Escribe nuevamente tu contraseña"
        />
        {errores.confirmarPassword && (
          <small className="error">{errores.confirmarPassword}</small>
        )}

        <button className="boton-principal" type="submit">
          Validar registro <ArrowRight size={18} />
        </button>

        {mensaje && (
          <div className="mensaje-formulario" role="status">
            {mensaje}
          </div>
        )}
      </form>

      <p className="nota-privacidad">
        Tus datos deben tratarse de forma segura y conforme a la
        política de tratamiento de datos personales.
      </p>
    </div>
  </section>
)}

{pantalla === "panelTrabajador" && (
  <section className="catalogo">
    <div className="catalogo-titulo">
      <div>
        <span className="subtitulo-catalogo">
          SOLUCIONA / PANEL DEL TRABAJADOR
        </span>
        <h1>¡Bienvenido a SOLUCIONA!</h1>
        <p>
          Administra tus servicios y mantente al tanto
          de las oportunidades de trabajo.
        </p>
      </div>
      <div className="icono-busqueda">
        <Wrench size={25} />
      </div>
    </div>

    <div className="perfil-contenedor">
      <div className="perfil-datos">
        <span className="subtitulo-catalogo">
          MI CUENTA PROFESIONAL
        </span>
        <h2>Trabajador de demostración</h2>
        <p className="especialidad">
          Profesional independiente
        </p>
        <p>
          <MapPin size={15} /> Bogotá, Colombia
        </p>
        <span className="etiqueta-disponible">
          Disponible para trabajar
        </span>
      </div>
    </div>

    <h2>Resumen de actividad</h2>

    <div className="opciones">
      <article className="tarjeta">
        <div className="texto-tarjeta">
          <strong>Solicitudes recibidas</strong>
          <h2>0</h2>
          <small>Solicitudes pendientes</small>
        </div>
      </article>

      <article className="tarjeta">
        <div className="texto-tarjeta">
          <strong>Mis servicios</strong>
          <h2>3</h2>
          <small>Servicios de demostración</small>
        </div>
      </article>
    </div>

    <h2>Administrar mi cuenta</h2>

    <div className="opciones">
      <button
        className="tarjeta"
        onClick={() => setPantalla("perfilTrabajador")}
      >
        <span className="icono-tarjeta trabajador">
          <UserRound size={28} />
        </span>
        <span className="texto-tarjeta">
          <strong>Mi perfil</strong>
          <small>Editar mis datos profesionales</small>
        </span>
        <ArrowRight size={20} />
      </button>

      
      <button     
        className="tarjeta"
        onClick={() => setPantalla("serviciosTrabajador")}
      >
        <span className="icono-tarjeta trabajador">
          <Wrench size={28} />
        </span>
        <span className="texto-tarjeta">
          <strong>Mis servicios</strong>             
          <small>Administrar lo que ofrezco</small>
        </span>
        <ArrowRight size={20} />
      </button>

      <button
        className="tarjeta"
        onClick={() => setPantalla("solicitudesTrabajador")}
      >
        <span className="icono-tarjeta trabajador">
          <CheckCircle2 size={28} />
        </span>
        <span className="texto-tarjeta">
          <strong>Solicitudes recibidas</strong>
          <small>Consultar y gestionar solicitudes</small>
        </span>
        <ArrowRight size={20} />
      </button>
    </div>

    <p className="aviso-demostracion">
      Vista previa del panel. La información mostrada
      es demostrativa y todavía no está conectada
      con los datos reales del trabajador.
    </p>

    <button
      className="volver-catalogo"
      onClick={() => setPantalla("inicio")}
    >
      <ArrowLeft size={17} />
      Volver al inicio
    </button>
  </section>
)}
  
{pantalla === "perfilTrabajador" && (
  <section className="perfil-seccion">
    <div className="catalogo-titulo">
      <div>
        <span className="subtitulo-catalogo">
          SOLUCIONA / MI PERFIL
        </span>
        <h1>Mi perfil profesional</h1>
        <p>
          Mantén actualizada tu información para que los
          clientes conozcan tu experiencia.
        </p>
      </div>
      <div className="icono-busqueda">
        <UserRound size={25} />
      </div>
    </div>

    <form
      className="formulario"
     onSubmit={guardarPerfilTrabajador}
    ><div className="campo-fotografia">
  <label>Fotografía profesional</label>

  {fotoTrabajador ? (
    <img
      src={fotoTrabajador}
      alt="Fotografía del profesional"
      style={{
        width: "130px",
        height: "130px",
        objectFit: "cover",
        borderRadius: "50%",
        display: "block",
        margin: "12px 0"
      }}
    />
  ) : (
    <div
      style={{
        width: "130px",
        height: "130px",
        borderRadius: "50%",
        background: "#f5f8fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "12px 0"
      }}
    >
      <UserRound size={45} />
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(evento) => {
      const archivo = evento.target.files?.[0];

      if (archivo) {
        if (!archivo.type.startsWith("image/")) {
          setMensajePerfil("Selecciona un archivo de imagen.");
          return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
          setMensajePerfil("La fotografía no debe superar los 5 MB.");
          return;
        }

        setArchivoFoto(archivo);
        setFotoTrabajador(URL.createObjectURL(archivo));
        setMensajePerfil("");
      }
    }}
  />

  <small>Selecciona una fotografía de máximo 5 MB.</small>
</div>
      <label>Nombre completo</label>
      <input
        type="text"
        name="nombre"
        value={perfilTrabajador.nombre}
        onChange={actualizarPerfil}
        placeholder="Escribe tu nombre completo"
      />

      <label>Teléfono</label>
      <input
        type="tel"
        name="telefono"
        value={perfilTrabajador.telefono}
        onChange={actualizarPerfil}
        placeholder="Tu número de celular"
      />

      <label>Localidad</label>
      <input
        type="text"
        name="localidad"
        value={perfilTrabajador.localidad}
        onChange={actualizarPerfil}
        placeholder="Ej. Puente Aranda"
      />

      <label>Años de experiencia</label>
      <input
        type="number"
        min="0"
        name="experiencia"
        value={perfilTrabajador.experiencia}
        onChange={actualizarPerfil}
        placeholder="Ej. 5"
      />

      <label>Descripción profesional</label>
      <textarea
        name="descripcion"
        value={perfilTrabajador.descripcion}
        onChange={actualizarPerfil}
        placeholder="Cuéntales a tus clientes qué servicios realizas y cuál es tu experiencia."
        rows="5"
      />

      <button type="submit" className="boton-principal">
        Guardar cambios
      </button>

      {mensajePerfil && (
        <div className="mensaje-formulario" role="status">
          {mensajePerfil}
        </div>
      )}
    </form>

    <button
      className="volver-catalogo"
      onClick={() => {
        setMensajePerfil("");
        setPantalla("panelTrabajador");
      }}
    >
      <ArrowLeft size={17} />
      Volver al panel
    </button>
  </section>
)}

{/* SOLICITUDES RECIBIDAS DEL TRABAJADOR */}
{pantalla === "solicitudesTrabajador" && (
  <section className="perfil-seccion">
    <button
      className="boton-volver"
      onClick={() => setPantalla("panelTrabajador")}
    >
      <ArrowLeft size={18} />
      Volver al panel
    </button>

    <div className="encabezado-seccion">
      <h1>Solicitudes recibidas</h1>
      <p>
        Aquí puedes consultar los servicios que los clientes
        te han solicitado.
      </p>
    </div>

    {cargandoSolicitudes && (
      <p>Consultando tus solicitudes...</p>
    )}

    {mensajeSolicitudes && (
      <p className="mensaje">{mensajeSolicitudes}</p>
    )}

    {!cargandoSolicitudes &&
      !mensajeSolicitudes &&
      solicitudesTrabajador.length === 0 && (
        <div className="mensaje-vacio">
          <h3>Aún no tienes solicitudes</h3>
          <p>
            Cuando un cliente solicite uno de tus servicios,
            aparecerá aquí.
          </p>
        </div>
      )}

    <div className="lista-solicitudes">
      {solicitudesTrabajador.map((item) => (
        <article className="tarjeta-solicitud" key={item.id}>
          <div className="solicitud-cabecera">
            <h3>Solicitud de servicio</h3>

            <span className={`estado-solicitud ${item.status}`}>
              {item.status === "pending"
                ? "Pendiente"
                : item.status === "accepted"
                ? "Aceptada"
                : item.status === "rejected"
                ? "Rechazada"
                : item.status}
            </span>
          </div>

          <p>
            <strong>Descripción:</strong> {item.description}
          </p>

          <p>
            <strong>Dirección:</strong> {item.service_address}
          </p>

          <p>
            <strong>Urgencia:</strong>{" "}
            {item.urgent ? "Sí, es urgente" : "No"}
          </p>

          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(item.created_at).toLocaleString("es-CO")}
          </p>

          {item.status === "pending" && (
            <div className="acciones-solicitud">
              <button
                type="button"
                className="boton-aceptar"
                onClick={() =>
                  responderSolicitud(item.id, "accepted")
                }
              >
                Aceptar servicio
              </button>

              <button
                type="button"
                className="boton-rechazar"
                onClick={() =>
                  responderSolicitud(item.id, "rejected")
                }
              >
                Rechazar
              </button>
            </div>
          )}
        </article>
      ))}
    </div>
  </section>
)}



{pantalla === "serviciosTrabajador" && (
  
  <section className="perfil-seccion">
    <div className="catalogo-titulo">
      <div>
        <h2>Mis servicios</h2>
        <p>Administra los servicios que ofreces a tus clientes.</p>
      </div>
    </div>

    

<div className="formulario">
  <h3>Agregar un servicio</h3>

  <form onSubmit={guardarNuevoServicio}>
    <label>Categoría del servicio</label>
    <select
      value={nuevoServicio.categoria}
      onChange={(evento) =>
        setNuevoServicio({
          ...nuevoServicio,
          categoria: evento.target.value
        })
      }
    >
      <option value="">Selecciona una categoría</option>
      <option value="Plomería">Plomería</option>
      <option value="Electricidad">Electricidad</option>
      <option value="Pintura">Pintura</option>
      <option value="Aseo">Aseo</option>
      <option value="Jardinería">Jardinería</option>
      <option value="Carpintería">Carpintería</option>
      <option value="Mantenimiento">Mantenimiento</option>
    </select>

    <label>Nombre del servicio</label>
    <input
      type="text"
      value={nuevoServicio.nombre}
      onChange={(evento) =>
        setNuevoServicio({
          ...nuevoServicio,
          nombre: evento.target.value
        })
      }
      placeholder="Ej. Reparación de tuberías"
    />

    <label>Descripción</label>
    <textarea
      rows="4"
      value={nuevoServicio.descripcion}
      onChange={(evento) =>
        setNuevoServicio({
          ...nuevoServicio,
          descripcion: evento.target.value
        })
      }
      placeholder="Describe el trabajo que realizas..."
    />

    <button type="submit" className="boton-principal">
      Guardar servicio
    </button>
  </form>

  {mensajeServicio && (
    <div className="mensaje-formulario" role="status">
      {mensajeServicio}
    </div>
  )}

  <h3>Servicios registrados</h3>

  {cargandoServicios && <p>Cargando servicios...</p>}

  {!cargandoServicios && serviciosTrabajador.length === 0 && (
    <p>Aún no tienes servicios registrados.</p>
  )}

 
{serviciosTrabajador.map((servicio) => (
  <div className="tarjeta" key={servicio.id}>
    <div>
      <strong>{servicio.service_name}</strong>
      <p>{servicio.category}</p>
      <small>{servicio.description}</small>

      <p>
        Estado: {servicio.active ? "Activo" : "Inactivo"}
      </p>
    </div>

    <button
      type="button"
      className="boton-principal"
      onClick={() => cambiarEstadoServicio(servicio)}
    >
      {servicio.active ? "Desactivar" : "Activar"}
    </button>

<button
  type="button"
  className="boton-principal"
  onClick={() => eliminarServicio(servicio)}
>
  Eliminar
</button>

  </div>
))}

</div>
  <button
      className="volver-catalogo"
      onClick={() => setPantalla("panelTrabajador")}
    >
      <ArrowLeft size={17} /> Volver al panel
    </button>
     </section>
)}
{pantalla === "catalogo" && (
 
  <section className="catalogo">
    {misSolicitudes.some(
  (item) => item.status === "accepted"
) && (
  <div className="aviso-aceptacion-cliente">
    <div className="icono-aviso-aceptacion">
      <Bell size={24} />
    </div>

    <div>
      <strong>¡Buenas noticias! Tienes una solicitud aceptada.</strong>
      <p>
        Un profesional ha aceptado atender uno de tus servicios.
        Consulta los detalles en Mis solicitudes.
      </p>

      <button
        type="button"
        onClick={() => setPantalla("misSolicitudes")}
      >
        Ver mi solicitud <ArrowRight size={16} />
      </button>
    </div>
  </div>
)}


    <div className="catalogo-titulo">
      <div>
        <span className="subtitulo-catalogo">
          SOLUCIONA / SERVICIOS
        </span>
        <h1>Encuentra ayuda experta en tu barrio</h1>
        <p>
          Profesionales independientes para solucionar
          las necesidades de tu hogar.
        </p>
      </div>

      <div className="icono-busqueda">
        <Search size={25} />
      </div>
    </div>
<div className="acceso-mis-solicitudes">
  <button
    type="button"
    onClick={() => setPantalla("misSolicitudes")}
  >
    <Bell size={19} />
    Mis solicitudes
    {misSolicitudes.filter(
      (item) => item.status === "accepted"
    ).length > 0 && (
      <span className="contador-notificaciones">
        {misSolicitudes.filter(
          (item) => item.status === "accepted"
        ).length}
      </span>
    )}
  </button>
</div> 

    <div className="categorias">
      {["Todos", "Plomería", "Electricidad", "Carpintería", "Aseo"].map(
        (categoria) => (
          <button
            key={categoria}
            className={
              categoriaActiva === categoria
                ? "categoria activa"
                : "categoria"
            }
            onClick={() => setCategoriaActiva(categoria)}
          >
            {categoria}
          </button>
        )
      )}
    </div>

    <div className="resultado-catalogo">
      <strong>{profesionalesFiltrados.length} profesionales</strong>
      <span>Por distancia</span>
    </div>

    <div className="lista-profesionales">
      {profesionalesFiltrados.map((profesional) => (
        <article className="tarjeta-profesional" key={profesional.id}>

          <div className="foto-profesional">
            <div className="avatar-profesional">
              {profesional.foto ? (
                <img
                  src={profesional.foto}
                  alt={`Fotografía de ${profesional.nombre}`}
                  className="imagen-profesional"
                />
              ) : (
                <UserRound size={38} />
              )}
            </div>

            {profesional.verificado && (
              <span className="etiqueta-verificado">
                <BadgeCheck size={13} /> Verificado
              </span>
            )}

            <span
              className={
                profesional.disponible
                  ? "etiqueta-disponible"
                  : "etiqueta-ocupado"
              }
            >
              {profesional.disponible ? "Disponible" : "Ocupado"}
            </span>
          </div>

          <div className="datos-profesional">
            <h3>{profesional.nombre}</h3>

            <span className="especialidad">
              {profesional.servicio}
            </span>

            <div className="calificacion">
              <Star size={15} fill="currentColor" />
              <strong>{profesional.calificacion}</strong>
              <span>({profesional.resenas} reseñas)</span>
            </div>

            <div className="ubicacion-profesional">
              <MapPin size={14} />
              <span>{profesional.ubicacion}</span>
              <span className="distancia">
                {profesional.distancia}
              </span>
            </div>

            <div className="tarifa-profesional">
              {profesional.tarifa}
            </div>

            <button
              className="boton-ver-perfil"
              onClick={() => {
                setProfesionalSeleccionado(profesional);
                setMensaje("");
                setPantalla("perfil");
              }}
            >
              Ver perfil <ArrowRight size={16} />
            </button>

          </div>
        </article>
      ))}
  </div>

  <button
    className="volver-catalogo"
    onClick={() => setPantalla("inicio")}
  >
    <ArrowLeft size={17} /> Volver al inicio
  </button>

  {mensaje && (
    <div className="mensaje-formulario" role="status">
      {mensaje}
    </div>
  )}

    <p className="aviso-demostracion">
      Información de ejemplo para demostración del prototipo.
    </p>

  </section>
)}

{pantalla === "misSolicitudes" && (
  <section className="pagina-mis-solicitudes">

    <div className="encabezado-mis-solicitudes">
      <span className="subtitulo-catalogo">
        SOLUCIONA / MIS SERVICIOS
      </span>

      <h1>Mis solicitudes</h1>

      <p>
        Consulta el estado de los servicios que has solicitado.
      </p>
    </div>

    <button
      className="boton-actualizar-solicitudes"
      onClick={cargarMisSolicitudes}
    >
      Actualizar solicitudes
    </button>

    {cargandoMisSolicitudes && (
      <p>Cargando tus solicitudes...</p>
    )}

    {mensajeMisSolicitudes && (
      <div className="mensaje-formulario" role="status">
        {mensajeMisSolicitudes}
      </div>
    )}

    {!cargandoMisSolicitudes && misSolicitudes.length === 0 && (
      <div className="mensaje-sin-solicitudes">
        <h3>Aún no tienes solicitudes</h3>
        <p>
          Cuando solicites un servicio, podrás consultar aquí
          si el profesional lo aceptó o rechazó.
        </p>
      </div>
    )}

    {misSolicitudes.map((item) => (
      <article className="tarjeta-mi-solicitud" key={item.id}>

        <div className="solicitud-cabecera">
          <h3>Solicitud #{item.id}</h3>

          <span className={`estado-solicitud ${
            item.status === "accepted"
              ? "aceptada"
              : item.status === "rejected"
              ? "rechazada"
              : "pendiente"
          }`}>
            {item.status === "accepted"
              ? "Aceptada"
              : item.status === "rejected"
              ? "Rechazada"
              : "Pendiente"}
          </span>
        </div>

        <div className="detalle-solicitud">
          <p>
            <strong>Descripción:</strong> {item.description}
          </p>

          <p>
            <strong>Dirección:</strong> {item.service_address}
          </p>

          <p>
            <strong>Urgente:</strong> {item.urgent ? "Sí" : "No"}
          </p>
        </div>

        {item.status === "accepted" && (
          <div className="notificacion-solicitud aceptada">
            <CheckCircle2 size={22} />
            <div>
              <strong>¡Buenas noticias!</strong>
              <p>
                El profesional ha aceptado tu solicitud.
                Ya puedes coordinar los detalles del servicio.
              </p>
            </div>
          </div>
        )}

        {item.status === "rejected" && (
          <div className="notificacion-solicitud rechazada">
            <div>
              <strong>Solicitud rechazada</strong>
              <p>
                El profesional no puede atender este servicio.
                Puedes buscar otro profesional en SOLUCIONA.
              </p>
            </div>
          </div>
        )}

        {item.status === "pending" && (
          <div className="notificacion-solicitud pendiente">
            Tu solicitud está pendiente de respuesta.
          </div>
        )}

      </article>
    ))}

    <button
      className="volver-catalogo"
      onClick={() => setPantalla("catalogo")}
    >
      <ArrowLeft size={17} /> Volver al catálogo
    </button>

  </section>
)}


{pantalla === "perfil" && profesionalSeleccionado && (
  <section className="perfil-seccion">

    <button
      className="volver-catalogo"
      onClick={() => {
        setPantalla("catalogo");
        setMensaje("");
      }}
    >
      <ArrowLeft size={17} /> Volver a profesionales
    </button>

    <article className="perfil-contenedor">

      <div className="perfil-foto">
        <div className="perfil-avatar">
        {profesionalSeleccionado.foto ? (
          <img
            src={profesionalSeleccionado.foto}
            alt={`Fotografía de ${profesionalSeleccionado.nombre}`}
            className="imagen-profesional"
          />
        ) : (
          <Wrench size={100} />
        )}
      </div>
        {profesionalSeleccionado.verificado && (
          <span className="etiqueta-verificado">
            <BadgeCheck size={14} /> Verificado
          </span>
        )}

        <span
          className={
            profesionalSeleccionado.disponible
              ? "etiqueta-disponible"
              : "etiqueta-ocupado"
          }
        >
          {profesionalSeleccionado.disponible
            ? "Disponible"
            : "Ocupado"}
        </span>
      </div>

      <div className="perfil-datos">

        <span className="subtitulo-catalogo">
          INFORMACIÓN DEL PROFESIONAL
        </span>

        <h1>{profesionalSeleccionado.nombre}</h1>

        <p className="especialidad">
          {profesionalSeleccionado.servicio}
        </p>

        <div className="calificacion perfil-calificacion">
          <Star size={17} fill="currentColor" />
          <strong>{profesionalSeleccionado.calificacion}</strong>
          <span>
            ({profesionalSeleccionado.resenas} reseñas)
          </span>
        </div>

        <div className="perfil-informacion">
          <div>
            <span>Localidad</span>
            <strong>{profesionalSeleccionado.ubicacion || "No registrada"}</strong>
          </div>

          <div>
            <span>Experiencia</span>
            <strong>
              {profesionalSeleccionado.aniosExperiencia != null
                ? `${profesionalSeleccionado.aniosExperiencia} años`
                : "No especificada"}
            </strong>
          </div>

          <div>
            <span>Tarifa</span>
            <strong>Consultar al profesional</strong>
          </div>
        </div>

        <h3>Sobre mí</h3>

        <p className="perfil-descripcion">
          {profesionalSeleccionado.experiencia}
        </p>

        <h3>Servicios</h3>

        <div className="servicios-etiquetas">
          {profesionalSeleccionado.serviciosDetalle.map(
            (servicio, indice) => (
              <span key={indice}>{servicio}</span>
            )
          )}
        </div>

        
<div className="formulario-solicitud perfil-formulario">

  <h3>Solicita tu servicio</h3>
  <p>Cuéntanos qué necesitas y dónde debemos realizar el trabajo.</p>

  <form onSubmit={enviarSolicitud}>

    <label htmlFor="descripcionSolicitud">
      Describe el trabajo que necesitas
    </label>
    <textarea
      id="descripcionSolicitud"
      value={solicitud.descripcion}
      onChange={(evento) =>
        setSolicitud({
          ...solicitud,
          descripcion: evento.target.value
        })
      }
      placeholder="Ejemplo: necesito reparar una fuga de agua..."
      rows={3}
    />

    {erroresSolicitud.descripcion && (
      <p className="mensaje-error">
        {erroresSolicitud.descripcion}
      </p>
    )}

    <label htmlFor="direccionSolicitud">
      Dirección del servicio
    </label>
    <input
      id="direccionSolicitud"
      type="text"
      value={solicitud.direccion}
      onChange={(evento) =>
        setSolicitud({
          ...solicitud,
          direccion: evento.target.value
        })
      }
      placeholder="Escribe la dirección del servicio"
    />

    {erroresSolicitud.direccion && (
      <p className="mensaje-error">
        {erroresSolicitud.direccion}
      </p>
    )}

    <label className="opcion-urgente">
      <input
        type="checkbox"
        checked={solicitud.urgente}
        onChange={(evento) =>
          setSolicitud({
            ...solicitud,
            urgente: evento.target.checked
          })
        }
      />
      Necesito atención urgente
    </label>

    {mensaje && (
      <p className="mensaje-formulario" role="status">
        {mensaje}
      </p>
    )}

    <button
      type="submit"
      className="boton-solicitar"
    >
      Enviar solicitud <ArrowRight size={18} />
    </button>

  </form>
</div>


        {mensaje && (
          <div className="mensaje-formulario" role="status">
            {mensaje}
          </div>
        )}

      </div>
    </article>

  </section>
)}
   
{pantalla === "solicitud" && profesionalSeleccionado && (
  <section className="solicitud-seccion">

    <button
      className="volver-catalogo"
      onClick={() => setPantalla("perfil")}
    >
      <ArrowLeft size={17} /> Volver al perfil
    </button>

    <div className="solicitud-contenedor">

      <span className="subtitulo-catalogo">
        SOLICIONA / NUEVA SOLICITUD
      </span>

      <h1 className="titulo-solicitud">
        Cuéntanos qué necesitas
      </h1>

      <p className="descripcion">
        Describe el trabajo para que el profesional
        conozca los detalles de tu solicitud.
      </p>

      <div className="profesional-solicitud">
        <div className="avatar-solicitud">
          <Wrench size={27} />
        </div>

        <div>
          <strong>{profesionalSeleccionado.nombre}</strong>
          <span>{profesionalSeleccionado.servicio}</span>
          <small>
            {profesionalSeleccionado.ubicacion}
          </small>
        </div>
      </div>

      <form onSubmit={enviarSolicitud} noValidate>

        <label htmlFor="descripcion-solicitud">
          Describe el trabajo que necesitas *
        </label>

        <textarea
          id="descripcion-solicitud"
          name="descripcion"
          value={solicitud.descripcion}
          onChange={actualizarSolicitud}
          placeholder="Ejemplo: Necesito reparar una fuga de agua en el baño..."
          rows="5"
        />

        {erroresSolicitud.descripcion && (
          <small className="error">
            {erroresSolicitud.descripcion}
          </small>
        )}

        <label htmlFor="direccion-solicitud">
          Dirección o ubicación del servicio *
        </label>

        <input
          id="direccion-solicitud"
          name="direccion"
          value={solicitud.direccion}
          onChange={actualizarSolicitud}
          placeholder="Ejemplo: Barrio Galán, Bogotá"
        />

        {erroresSolicitud.direccion && (
          <small className="error">
            {erroresSolicitud.direccion}
          </small>
        )}

        <div className="opcion-urgencia">
          <div>
            <strong>¿Necesitas atención urgente?</strong>
            <p>
              Indica si necesitas que el profesional
              atienda tu solicitud lo antes posible.
            </p>
          </div>

          <label className="interruptor-urgencia">
            <input
              type="checkbox"
              name="urgente"
              checked={solicitud.urgente}
              onChange={actualizarSolicitud}
            />
            <span className="interruptor-visual"></span>
          </label>
        </div>

        <button
          className="boton-enviar-solicitud"
          type="submit"
        >
          Continuar <ArrowRight size={18} />
        </button>

      </form>

      <p className="nota-privacidad">
        Tu información se utilizará para gestionar la solicitud
        del servicio. Evita incluir datos personales innecesarios.
      </p>

    </div>
  </section>
)}


{pantalla === "solicitarServicio" && profesionalSeleccionado && (
  <section className="solicitud-seccion">
    <div className="formulario-solicitud">
      <h1>Solicitar servicio</h1>
      <p>
        Estás solicitando el servicio de{" "}
        <strong>{profesionalSeleccionado.nombre}</strong>
      </p>

      <form onSubmit={enviarSolicitud}>
        <label htmlFor="descripcionSolicitud">
          Describe el trabajo que necesitas
        </label>
        <textarea
          id="descripcionSolicitud"
          value={solicitud.descripcion}
          onChange={(evento) =>
            setSolicitud({
              ...solicitud,
              descripcion: evento.target.value
            })
          }
          placeholder="Cuéntanos qué trabajo necesitas realizar..."
          rows={4}
        />
        {erroresSolicitud.descripcion && (
          <p className="mensaje-error">{erroresSolicitud.descripcion}</p>
        )}

        <label htmlFor="direccionSolicitud">
          Dirección donde se realizará el servicio
        </label>
        <input
          id="direccionSolicitud"
          type="text"
          value={solicitud.direccion}
          onChange={(evento) =>
            setSolicitud({
              ...solicitud,
              direccion: evento.target.value
            })
          }
          placeholder="Ej. Calle 10 # 20-30, Bogotá"
        />
        {erroresSolicitud.direccion && (
          <p className="mensaje-error">{erroresSolicitud.direccion}</p>
        )}

        <label className="opcion-urgente">
          <input
            type="checkbox"
            checked={solicitud.urgente}
            onChange={(evento) =>
              setSolicitud({
                ...solicitud,
                urgente: evento.target.checked
              })
            }
          />
          Necesito atención urgente
        </label>

        {mensaje && <p className="mensaje-formulario">{mensaje}</p>}

        <button
          type="submit"
          className="boton-enviar-solicitud"
        >
           Continuar <ArrowRight size={18} />
        </button>

        <button
          type="button"
          className="volver-catalogo"
          onClick={() => setPantalla("perfil")}
        >
          Volver al perfil
        </button>
      </form>
    </div>
  </section>
)}

{pantalla === "confirmacion" && profesionalSeleccionado && (
  <section className="solicitud-seccion">
    <div className="confirmacion-contenedor">

      <div className="confirmacion-icono">
        <CheckCircle2 size={48} />
      </div>

      <h1>¡Solicitud enviada!</h1>

      <p>
        Tu solicitud para el servicio de{" "}
        {profesionalSeleccionado.servicio} ha sido enviada
        correctamente al profesional.
      </p>

      <div className="resumen-solicitud">
        <strong>Profesional</strong>
        <span>{profesionalSeleccionado.nombre}</span>

        <strong>Descripción del trabajo</strong>
        <span>{solicitud.descripcion}</span>

        <strong>Ubicación</strong>
        <span>{solicitud.direccion}</span>

        <strong>Atención urgente</strong>
        <span>{solicitud.urgente ? "Sí" : "No"}</span>

        <strong>Estado de la solicitud</strong>
        <span className="estado-pendiente">Pendiente de respuesta</span>
      </div>

      <div className="aviso-pendiente">
        Tu solicitud fue registrada correctamente.
        El profesional podrá revisarla y aceptar o rechazar el servicio.
      </div>

      <button
        type="button"
        className="boton-enviar-solicitud"
        onClick={() => {
          setSolicitud({
            descripcion: "",
            direccion: "",
            urgente: false
          });
          setErroresSolicitud({});
          setMensaje("");
          setPantalla("catalogo");
        }}
      >
        Volver al catálogo <ArrowRight size={18} />
      </button>

    </div>
  </section>
)}

      <footer className="pie">
        <span>© 2026 SOLUCIONA</span> 
        <span>Conectando clientes y profesionales</span>
      </footer>
    </main>
  );
}


export default App;