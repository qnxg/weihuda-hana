import { auth } from "@server/routes/auth"
import { root } from "@server/routes/root"

export const route = { root, auth }

export * from "@server/routes/auth"
export * from "@server/routes/root"
