import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  school: String, // relatórios por escola
  className: String, // relatórios por turma
  age: Number, // análise de faixa etária
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  trailsCompleted: { type: Number, default: 0 },
  trailCompletionPercentage: { type: Number, default: 0 }, // % de trilha concluída
  dropOffPoint: String, // onde aluno desistiu
  totalTimeUsed: { type: Number, default: 0 }, // em minutos
  lastAccess: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);