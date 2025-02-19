import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to the admin login page
  redirect("/login");
}
