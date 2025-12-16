import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import "../../TicketStyles.css";

import { MdAdd, MdAccessTime, MdPerson } from "react-icons/md";

const API_URL = "/api/tickets/";

const CATALOGO_PROBLEMAS = [
  { id: "pwd", label: "Restablecer Contraseña", prioridad: "baja" },
  { id: "soft", label: "Instalación de Software", prioridad: "baja" },
  { id: "wifi", label: "Problemas de Conexión / WIFI", prioridad: "media" },
  { id: "access", label: "Error de Permisos / Acceso", prioridad: "media" },
  { id: "hard", label: "Fallo de Hardware", prioridad: "alta" },
  { id: "pay", label: "Problema de Facturación", prioridad: "alta" },
  { id: "down", label: "Sistema Caído", prioridad: "urgente" },
  { id: "sec", label: "Incidente de Seguridad", prioridad: "urgente" },
];

const PRIORIDAD_ORDEN = { urgente: 1, alta: 2, media: 3, baja: 4 };

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const ES_SOPORTE = user?.rol === "soporte" || user?.esAdmin;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    categoria: "",
    titulo: "",
    descripcion: "",
    prioridad: "baja",
  });

  const { categoria, titulo, descripcion, prioridad } = formData;

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${user.token}` },
  });

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      try {
        const res = await axios.get(API_URL, getConfig());
        setTickets(res.data || []);
      } catch {
        toast.error("Error al cargar tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const ticketsProcesados = [...tickets].sort((a, b) => {
  // ===== SOPORTE: por prioridad =====
  if (ES_SOPORTE) {
    return (
      (PRIORIDAD_ORDEN[a.prioridad] || 99) -
      (PRIORIDAD_ORDEN[b.prioridad] || 99)
    );
  }

  // ===== USUARIO =====
  // 1️⃣ Cerrados SIEMPRE hasta abajo
  if (a.estado === "cerrado" && b.estado !== "cerrado") return 1;
  if (a.estado !== "cerrado" && b.estado === "cerrado") return -1;

  // 2️⃣ Luego por fecha (más reciente primero)
  return new Date(b.createdAt) - new Date(a.createdAt);
});


  const ticketsFinales = ES_SOPORTE
    ? ticketsProcesados.filter((t) => t.estado !== "cerrado")
    : ticketsProcesados;

  const pendientes = tickets.filter((t) => t.estado && t.estado !== "cerrado").length;

  const crearTicket = async (e) => {
    e.preventDefault();
    if (!categoria || !titulo || !descripcion) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const res = await axios.post(
        API_URL,
        { titulo, descripcion, prioridad },
        getConfig()
      );
      setTickets((prev) => [res.data, ...prev]);
      setFormData({ categoria: "", titulo: "", descripcion: "", prioridad: "baja" });
      toast.success("Ticket creado correctamente");
    } catch {
      toast.error("Error al crear ticket");
    }
  };

  const onCategoriaChange = (e) => {
    const seleccion = e.target.value;
    const problema = CATALOGO_PROBLEMAS.find((p) => p.label === seleccion);
    setFormData((prev) => ({
      ...prev,
      categoria: seleccion,
      prioridad: problema?.prioridad || "baja",
      titulo: prev.titulo || problema?.label || "",
    }));
  };

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="ts-container">
      {/* HEADER */}
      <div className="ts-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="ts-title" style={{ color: "#fff" }}>
            {ES_SOPORTE ? "Centro de Soporte" : "Panel de Control"}
          </h1>
          <div className="ts-meta" style={{ color: "#94a3b8" }}>
            Bienvenido, {user.nombre}
          </div>
        </div>

        <span className="ts-badge in_progress" style={{ background: "#3b82f6", color: "white" }}>
          {pendientes} Pendientes
        </span>
      </div>

      <div className={ES_SOPORTE ? "ts-grid-full" : "ts-grid"}>
        {/* FORM USUARIO */}
        {!ES_SOPORTE && (
          <div className="ts-content">
            <div className="ts-card">
              <div className="ts-card-header">
                <MdAdd /> Crear Nuevo Ticket
              </div>
              <div className="ts-card-body">
                <form onSubmit={crearTicket}>
                  <select className="ts-textarea" value={categoria} onChange={onCategoriaChange}>
                    <option value="" disabled>Selecciona un problema…</option>
                    {CATALOGO_PROBLEMAS.map((p) => (
                      <option key={p.id} value={p.label}>{p.label}</option>
                    ))}
                  </select>

                  <input className="ts-textarea" name="titulo" value={titulo} onChange={onChange} placeholder="Asunto" />
                  <textarea className="ts-textarea" name="descripcion" rows="4" value={descripcion} onChange={onChange} placeholder="Describe el problema…" />

                  <button className="btn" style={{ width: "100%" }}>
                    <MdAdd /> Generar Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* GRID TICKETS */}
        <div className={ES_SOPORTE ? "ts-dashboard-grid" : "ts-sidebar-list"}>
          {loading ? (
            <Spinner />
          ) : ticketsFinales.length === 0 ? (
            <div className="ts-card" style={{ padding: "2rem", textAlign: "center" }}>
              No hay tickets pendientes
            </div>
          ) : (
            ticketsFinales.map((ticket) => {
              const estadoClass = ticket.estado
                ? ticket.estado.replace(" ", "_").toLowerCase()
                : "";

              return (
                <Link to={`/ticket/${ticket._id}`} key={ticket._id} style={{ textDecoration: "none" }}>
                  <div className="ts-card ts-card-interactive">
                    <div style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span className={`ts-badge ${estadoClass}`}>{ticket.estado}</span>
                        {ES_SOPORTE && (
                          <span className={`ts-badge ${ticket.prioridad}`}>
                            {ticket.prioridad}
                          </span>
                        )}
                      </div>

                      <h4>{ticket.titulo}</h4>

                      {ES_SOPORTE && (
                        <p style={{ fontSize: "0.8rem", color: "#475569" }}>
                          <MdPerson /> {ticket.usuario?.nombre || "Usuario"}
                        </p>
                      )}

                      <p className="ts-card-desc">{ticket.descripcion}</p>

                      <div className="ts-card-footer">
                        <MdAccessTime /> {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
