import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    // Load Markdown and MDX files in the `src/content/blog/` directory.
    loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        description: z.string(),
        // Transform string to Date object
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
    }),
});

const project = defineCollection({
    loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
    schema: z.object({
        title: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()).optional(),
        url: z.string().optional(),
        githubUrl: z.string().optional(),
    }),
});

export const collections = { blog, project };
