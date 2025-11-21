
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
  const userId = await currentUser()



  if (!userId) {
    redirect("/"); 
  }

  return <main>{children}</main>;
}
