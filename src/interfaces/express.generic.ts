import { Request } from "express";
import { userType } from "../models/user.model";
import { Document } from "mongodb";

export interface AuthenticatedRequest extends Request{
    user: Omit<userType, "password"> & Document
}