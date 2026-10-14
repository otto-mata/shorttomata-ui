import z from "zod";

export const LinkURL = z.httpUrl();

export type LinkURLType = z.infer<typeof LinkURL>;
