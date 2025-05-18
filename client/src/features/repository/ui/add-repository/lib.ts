import { z } from "zod";

export const repositorySchema = z.object({
  repositoryPath: z
    .string()
    .min(3, "Repository path is required")
    .regex(
      /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
      "Repository path must be in the format owner/repo"
    ),
});

export type RepositoryFormValues = z.infer<typeof repositorySchema>;
