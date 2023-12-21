"use server";

import { action } from "@/lib/action";
import { createProjectActionSchema } from "@/common/schemas/project.schema";

import { createProject } from "../repository/project.repository";

export const createProjectAction = action(
  createProjectActionSchema,
  async ({ ctx, input }) => {
    const { db } = ctx;

    const p = await createProject(db, input);

    return {
      message: "project created successfully",
    };
  }
);
