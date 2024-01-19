import { NextFunction, Request, Response } from "express";

const deleteJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies["HIGUY_TOKEN"];

    if (!token) {
      return res.status(401).json({ ok: false });
    }
    return res.clearCookie("HIGUY_TOKEN").status(200).json({
      ok: true,
    });
  } catch (e) {
    return next(e);
  }
};

export default deleteJWT;
