import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <ThemeToggle />
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/scan">scan</Link>
        </Button>
        <Button asChild>
          <Link href="/add-quiz">add quiz</Link>
        </Button>
        <Button asChild>
          <Link href="/stats">stats</Link>
        </Button>
      </div>
    </div>
  );
}
