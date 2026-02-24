import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, {message: "Name too short, apply for new passport"}),
});