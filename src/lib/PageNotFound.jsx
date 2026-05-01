import { useLocation, Link } from 'react-router-dom';
import LunaOrb from '../components/luna/LunaOrb';

export default function PageNotFound() {
    const location = useLocation();

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{ background: 'var(--bg-base)' }}
        >
            <div className="max-w-sm w-full text-center space-y-6">
                <LunaOrb size={100} state="idle" className="mx-auto" />

                <div className="space-y-2">
                    <h1
                        className="text-5xl font-light"
                        style={{ color: 'var(--text-muted-luna)' }}
                    >
                        404
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: 'var(--text-secondary-luna)' }}
                    >
                        Deze pagina bestaat niet.
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97]"
                    style={{
                        background: 'var(--luna-accent)',
                        color: '#fff',
                    }}
                >
                    Terug naar home
                </Link>
            </div>
        </div>
    );
}