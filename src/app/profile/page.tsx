import { AuthGate } from "@/components/auth/auth-gate";
import { ReaderProfile } from "@/components/reader/reader-profile";

export const metadata = { title: "My profile" };

export default function ProfilePage() {
  return <AuthGate><ReaderProfile /></AuthGate>;
}
