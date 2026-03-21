import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, UserCheck, UserMinus } from "lucide-react";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useAuth } from "../hooks/useAuth";
import { enrichMockUser, mockUsers } from "../utils/mockUsers";
import { getUserDisplayName } from "../utils/userDisplay";

const avatarColors = [
  "bg-purple-electric",
  "bg-accent-blue",
  "bg-accent-pink",
  "bg-accent-orange",
  "bg-indigo-500",
  "bg-teal-500",
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const AvatarIniciales = ({ user }) => {
  const displayName = getUserDisplayName(user);
  const parts = displayName.split(" ").filter(Boolean);
  const initials = `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? parts[0]?.[1] ?? ""}`.toUpperCase();
  const colorClass = getAvatarColor(displayName);
  return (
    <div className={`${colorClass} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg`}>
      {initials}
    </div>
  );
};

const UsuarioCell = ({ user }) => (
  <div className="flex items-center gap-3">
    <AvatarIniciales user={user} />
    <div className="flex flex-col">
      <span className="text-text-primary font-medium">{getUserDisplayName(user)}</span>
      <span className="text-text-secondary text-xs">{user.email}</span>
    </div>
  </div>
);

const RolBadge = ({ rol }) => {
  const styles = {
    admin: "bg-accent-pink/20 text-accent-pink border border-accent-pink/30",
    encargado: "bg-accent-blue/20 text-accent-blue border border-accent-blue/30",
    tecnico: "bg-purple-electric/20 text-purple-electric border border-purple-electric/30",
  };

  const labels = {
    admin: "Admin",
    encargado: "Encargado",
    tecnico: "Tecnico",
  };

  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[rol]}`}>{labels[rol] || rol}</span>;
};

const EstadoToggleIcon = ({ isActive }) =>
  isActive ? <UserCheck className="h-5 w-5 text-emerald-400" strokeWidth={2.1} /> : <UserMinus className="h-5 w-5 text-rose-400" strokeWidth={2.1} />;

export function UsuariosPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [usuariosState, setUsuariosState] = useState(() => mockUsers.map(enrichMockUser));
  const [confirmAction, setConfirmAction] = useState(null);

  const usuarios = useMemo(() => {
    const usersWithoutCurrentAdmin = usuariosState.filter((row) => row.id !== currentUser?.id);

    if (!searchQuery) return usersWithoutCurrentAdmin;

    const query = searchQuery.toLowerCase();
    return usersWithoutCurrentAdmin.filter((row) =>
      [getUserDisplayName(row), row.nombre_usuario, row.email, row.sucursal, row.area]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [currentUser?.id, searchQuery, usuariosState]);

  const toggleSuspension = (row) => {
    const isSuspended = row.estado_cuenta === "suspendido";

    setConfirmAction({
      title: isSuspended ? "Confirmar reactivacion" : "Confirmar suspension",
      actionLabel: isSuspended ? "reactivar" : "suspender",
      targetName: getUserDisplayName(row),
      confirmText: isSuspended ? "Reactivar cuenta" : "Suspender cuenta",
      onConfirm: () => {
        setUsuariosState((prev) =>
          prev.map((user) =>
            user.id === row.id
              ? {
                  ...user,
                  estado_cuenta: user.estado_cuenta === "suspendido" ? "activo" : "suspendido",
                }
              : user
          )
        );
        setConfirmAction(null);
        toast.success(isSuspended ? "Cuenta reactivada" : "Cuenta suspendida", {
          description: getUserDisplayName(row),
        });
      },
    });
  };

  const columns = [
    {
      key: "usuario",
      label: "Usuario",
      render: (val, row) => <UsuarioCell user={row} />,
    },
    { key: "rol", label: "Rol", render: (val) => <RolBadge rol={val} /> },
    {
      key: "sucursal",
      label: "Sucursal",
      render: (val) => <span className={val ? "text-text-primary" : "text-text-muted italic"}>{val || "-"}</span>,
    },
    {
      key: "area",
      label: "Area",
      render: (val) => <span className={val ? "text-text-primary" : "text-text-muted italic"}>{val || "-"}</span>,
    },
    { key: "estado_cuenta", label: "Estado", render: (val) => <Badge accountStatus={val} /> },
    {
      key: "acciones",
      label: "Acciones",
      render: (val, row) => {
        const isActive = row.estado_cuenta === "activo";
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/usuarios/editar/${row.id}`)}
              className="p-2 text-text-secondary hover:text-purple-electric hover:bg-dark-purple-700 rounded-lg transition-colors duration-200"
              title="Editar"
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => toggleSuspension(row)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              }`}
              title={isActive ? "Suspender cuenta" : "Reactivar cuenta"}
            >
              <EstadoToggleIcon isActive={isActive} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Usuarios</h1>
          <p className="text-text-secondary mt-1">Gestion de usuarios con contrato listo para backend</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuario..."
              className="w-64 bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            />
          </div>
          <Button onClick={() => navigate("/usuarios/nuevo")}>+ Nuevo Usuario</Button>
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-text-secondary text-lg">No hay usuarios registrados</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <Table columns={columns} data={usuarios} />
        </div>
      )}

      <Modal isOpen={Boolean(confirmAction)} onClose={() => setConfirmAction(null)} title={confirmAction?.title || "Confirmar accion"}>
        <p className="text-text-secondary text-sm mb-6">
          {confirmAction
            ? `Estas seguro de que deseas ${confirmAction.actionLabel} a ${confirmAction.targetName}? Esta accion no se puede deshacer.`
            : ""}
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => setConfirmAction(null)} className="w-auto px-5">
            Cancelar
          </Button>
          <Button type="button" onClick={() => confirmAction?.onConfirm?.()} className="w-auto px-5 bg-accent-pink hover:bg-accent-pink/90">
            {confirmAction?.confirmText || "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
