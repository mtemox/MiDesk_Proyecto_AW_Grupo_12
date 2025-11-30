// src/models/item.js
import { Schema, model } from "mongoose";

const itemSchema = new Schema(
  {
    // Usuario dueño del ítem
    userId: {
      type: Schema.Types.ObjectId,
      ref: "estudiante",
      required: true,
    },

    // Tipo de ítem: carpeta, nota, código, enlace, etc.
    type: {
      type: String,
      enum: ["folder", "note", "code", "link"],
      required: true,
    },

    // Nombre que se ve en el escritorio
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Solo para enlaces
    url: {
      type: String,
      default: null,
    },

    // Si es ítem raíz => null
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      default: null,
    },

    // Posición en el escritorio (para el frontend)
    position: {
      x: { type: Number, default: 100 },
      y: { type: Number, default: 100 },
    },
  },
  {
    timestamps: true,
  }
);

export default model("Item", itemSchema);
