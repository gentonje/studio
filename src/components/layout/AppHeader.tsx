import Link from 'next/link';
import { Stethoscope } from 'lucide-react'; // Example icon

const AppHeader = () => {
  return (
    <header id="app-header" className="bg-primary text-primary-foreground shadow-md no-print">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Stethoscope size={28} />
          HACT Navigator
        </Link>
        {/* Placeholder for potential user menu or actions */}
        <div></div>
      </div>
    </header>
  );
};

export default AppHeader;
