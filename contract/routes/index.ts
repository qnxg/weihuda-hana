import { auth } from "@contract/routes/auth"
import { root } from "@contract/routes/root"

export const contract = { root, auth }

export * from "@contract/routes/auth"
export * from "@contract/routes/root"
