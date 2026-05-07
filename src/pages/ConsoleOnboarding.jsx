import { useState } from "react";
import WordSelect from "./WordSelect";
import ConsoleIntro from "@/components/onboarding/ConsoleIntro";

export default function ConsoleOnboarding() {
  const [introDone, setIntroDone] = useState(false);

  if (!introDone) return <ConsoleIntro onDone={() => setIntroDone(true)} />;
  return <WordSelect />;
}