
import DashboardClientHeader from "./dashboard-client-header"
import { getSession } from "@/lib/actions"

export async function DashboardHeader() {
  const session = await getSession()
  if (!session) {
    return null
  }
  return (
    <DashboardClientHeader session={session} />
  )
}
