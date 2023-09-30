import { Request } from "express";

export interface CustomRequest extends Request{
    userId?: string; 
}

export interface JwtPayload{
    userId: string
}