import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";


export function ErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
   if (err instanceof AppError) {
      return res.status(err.statuscode).json({
         message: err.message
      });
   }

   console.log('err', err)

   return res.status(500).json({
      message: 'Internal server failure'
   })
}