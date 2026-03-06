import type { Request, Response } from "express";
export declare const getCartItems: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addToCart: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=cart.d.ts.map