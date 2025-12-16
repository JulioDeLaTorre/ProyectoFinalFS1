import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "./Spinner";
import "../../TicketStyles.css";

import { MdDescription, MdSend, MdCheckCircle, MdLock } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";

const API_URL = "/api/tickets/";
const REFRESH_TIME = 5000;

const Ticket = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [ticket, setTicket] = useState(null);
  const [textoNota, setTextoNota] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const intervaloRef = useRef(null);
  const yaMostroError = useRef(false);

  const ES_SOPORTE = user?.rol === "soporte";

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${user.token}` },
  });

  /* ===== CARGA SEGURA ===== */
  useEffect(() => {
    if (!user || !user.token) {
      clearInterval(intervaloRef.current);
      navigate("/login");
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await axios.get(`${API_URL}${ticketId}`, getConfig());
        setTicket(res.data);
        setLoading(false);
        yaMostroError.current = false;
      } catch {
        if (!yaMostroError.current) {
          toast.error("Error al cargar ticket");
          yaMostroError.current = true;
        }
        clearInterval(intervaloRef.current);
        setLoading(false);
      }
    };

    fetchTicket();
    intervaloRef.current = setInterval(fetchTicket, REFRESH_TIME);

    return () => clearInterval(intervaloRef.current);
  }, [ticketId, user, navigate]);

  /* ===== LIMPIEZA AL DESMONTAR ===== */
  useEffect(() => {
    return () => clearInterval(intervaloRef.current);
  }, []);

  /* ===== SCROLL CHAT ===== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.notas]);

  /* ===== CAMBIAR ESTADO ===== */
  const cambiarEstado = async (estado) => {
    try {
      const res = await axios.put(
        `${API_URL}${ticketId}`,
        { estado },
        getConfig()
      );
      setTicket(res.data);
      toast.success("Estado actualizado");
    } catch {
      toast.error("No se pudo cambiar el estado");
    }
  };

  /* ===== ENVIAR MENSAJE ===== */
  const enviarNota = async (e) => {
    e.preventDefault();
    if (!textoNota.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}${ticketId}/notas`,
        { texto: textoNota },
        getConfig()
      );

      setTicket((prev) => ({
        ...prev,
        notas: [...prev.notas, res.data],
      }));

      setTextoNota("");
    } catch {
      toast.error("Error al enviar mensaje");
    }
  };

  const statusClass = (estado) =>
    estado ? estado.replace(" ", "_").toLowerCase() : "";

  if (loading) return <Spinner />;

  if (!ticket)
    return (
      <div className="ts-container" style={{ textAlign: "center" }}>
        <h2 style={{ color: "#fff" }}>Ticket no encontrado</h2>
        <Link to="/dashboard" className="btn">Volver</Link>
      </div>
    );

  return (
    <div className="ts-container">
      <nav className="ts-breadcrumbs">
        <Link to="/dashboard" style={{ color: "#94a3b8" }}>Dashboard</Link>
        <FaChevronRight size={10} color="#94a3b8" />
        <span style={{ color: "#fff" }}>{ticket.titulo}</span>
      </nav>

      <div className="ts-header">
        <h1 className="ts-title">{ticket.titulo}</h1>
        <div className="ts-meta">
          Creado el {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="ts-grid">
        <div className="ts-content">
          <div className="ts-card">
            <div className="ts-card-header">
              <MdDescription /> Descripción
            </div>
            <div className="ts-card-body">{ticket.descripcion}</div>
          </div>

          <div className="ts-chat-container">
            <div className="ts-timeline">
              {ticket.notas.map((nota) => {
                const esMio = nota.usuario?._id === user._id;
                return (
                  <div
                    key={nota._id}
                    className={`ts-msg-row ${esMio ? "right" : "left"}`}
                  >
                    <div className="ts-msg-box">
                      <div className="ts-msg-name">
                        {nota.usuario?.nombre || "Usuario"} -{" "}
                        {nota.esStaff ? "Soporte" : "Usuario"}
                      </div>
                      <div className="ts-msg-text">{nota.texto}</div>
                      <div className="ts-msg-date">
                        {new Date(nota.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {ticket.estado !== "cerrado" ? (
              <div className="ts-card ts-input-card">
                <textarea
                  className="ts-textarea"
                  value={textoNota}
                  onChange={(e) => setTextoNota(e.target.value)}
                  placeholder="Escribe una respuesta…"
                />
                <div className="ts-input-footer">
                  <button className="btn" onClick={enviarNota}>
                    Enviar <MdSend />
                  </button>
                </div>
              </div>
            ) : (
              <div className="ts-card ts-locked">
                <MdLock size={28} />
                <p>Este ticket está cerrado</p>
              </div>
            )}
          </div>
        </div>

        <div className="ts-sidebar">
          <div className="ts-card">
            <div className="ts-card-header">Detalles</div>
            <div className="ts-card-body">
              <div className="ts-sidebar-item">
                <span>Estado</span>
                <span className={`ts-badge ${statusClass(ticket.estado)}`}>
                  {ticket.estado}
                </span>
              </div>
            </div>
          </div>

          {ES_SOPORTE && ticket.estado !== "cerrado" && (
            <div className="ts-card">
              <div className="ts-card-header">Acciones</div>
              <div className="ts-actions">
                <button
                  className="ts-action-btn warning"
                  onClick={() => cambiarEstado("en revisión")}
                >
                  En revisión
                </button>
                <button
                  className="ts-action-btn danger"
                  onClick={() => cambiarEstado("cerrado")}
                >
                  <MdCheckCircle /> Cerrar Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
