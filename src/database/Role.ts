import { Model, model, Schema, Document } from "mongoose";

const roleSchema = new Schema({
  roleID: String,
  guildID: String,
  duration: Number, // in milliseconds
  price: Number,
});


export interface RoleDocument extends Document {
  roleID: string;
  guildID: string;
  duration: number;
  price: number;
};

export interface RoleModel extends Model<RoleDocument> {};

export const Role = model<RoleDocument>("Role", roleSchema) as RoleModel;
