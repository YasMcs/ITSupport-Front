import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { TICKET_STATUS } from "../../constants/ticketStatus";

// Configuración de las columnas
const COLUMN_CONFIG = {
  [TICKET_STATUS.ABIERTO]: {
    id: TICKET_STATUS.ABIERTO,
    title: "Abierto",
    color: "accent-blue",
    bgColor: "bg-accent-blue",
    borderColor: "border-accent-blue/30",
  },
  [TICKET_STATUS.EN_PROCESO]: {
    id: TICKET_STATUS.EN_PROCESO,
    title: "En Proceso",
    color: "accent-orange",
    bgColor: "bg-accent-orange",
    borderColor: "border-accent-orange/30",
  },
  [TICKET_STATUS.CERRADO]: {
    id: TICKET_STATUS.CERRADO,
    title: "Cerrado",
    color: "dark-purple-700",
    bgColor: "bg-dark-purple-700",
    borderColor: "border-dark-purple-700",
  },
};

export function KanbanBoard({ tickets, onTicketMove }) {
  // Organizar tickets por columna
  const getTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.estado === status);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino o es el mismo lugar
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Si se cambió de columna, actualizar el estado
    if (destination.droppableId !== source.droppableId) {
      onTicketMove(draggableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
        {Object.values(COLUMN_CONFIG).map((column) => (
          <div
            key={column.id}
            className="flex-1 min-w-[320px] max-w-[400px] flex flex-col"
          >
            {/* Header de la columna */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${column.bgColor}`}
                />
                <h2 className="text-text-primary font-semibold">
                  {column.title}
                </h2>
              </div>
              <span
                className={`
                  px-2.5 py-1 rounded-full text-xs font-medium
                  ${column.bgColor}/20 text-${column.color} ${column.borderColor} border
                `}
              >
                {getTicketsByStatus(column.id).length}
              </span>
            </div>

            {/* Droppable area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                    flex-1 flex flex-col gap-3 p-3 rounded-2xl
                    bg-dark-purple-900/50 border border-dark-purple-700
                    transition-colors duration-200
                    ${snapshot.isDraggingOver ? "bg-dark-purple-800/50" : ""}
                    overflow-y-auto
                  `}
                >
                  {getTicketsByStatus(column.id).map((ticket, index) => (
                    <KanbanCard
                      key={ticket.id}
                      ticket={ticket}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                  
                  {getTicketsByStatus(column.id).length === 0 && !snapshot.isDraggingOver && (
                    <div className="flex items-center justify-center h-32 text-text-muted text-sm">
                      Sin tickets
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
