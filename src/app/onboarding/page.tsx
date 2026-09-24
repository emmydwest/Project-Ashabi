import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { AuthGate } from "@/components/auth/auth-gate";

export const metadata = { title: "Make Ashabi yours" };

export default function OnboardingPage() {
  return (
    <main id="main" className="onboarding-page">
      <AuthGate><OnboardingFlow /></AuthGate>
    </main>
  );
}
