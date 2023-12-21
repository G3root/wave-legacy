import * as z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const createProjectActionSchema = createProjectSchema.extend({
  workspaceId: z.string(),
});

export type TCreateProjectSchema = z.infer<typeof createProjectSchema>;
