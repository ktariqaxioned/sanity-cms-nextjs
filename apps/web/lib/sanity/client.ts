import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "oiozo98b",
  dataset: "production",
  apiVersion: "2024-01-01",
  perspective: "published",
  useCdn: false,
});