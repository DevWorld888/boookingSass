// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth" // Ajusta la ruta según tu estructura

export const { GET, POST } = handlers
