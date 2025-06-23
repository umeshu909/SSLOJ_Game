import type { Metadata } from "next";
import CharacterAbilitiesManager from "./ClientAbilities";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <CharacterAbilitiesManager />;
}
