import { ReaderHome } from "@/components/reader/reader-home";
import { AuthGate } from "@/components/auth/auth-gate";

export const metadata = { title: "Reader home" };

export default function ReaderHomePage() {
  return <AuthGate><ReaderHome /></AuthGate>;
}
