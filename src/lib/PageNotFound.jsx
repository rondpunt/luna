import { Link } from 'react-router-dom';
import JunieLogo from '@/components/brand/JunieLogo';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FFFBF7' }}>
      <div className="max-w-sm w-full text-center space-y-6">
        <div className="float-y" style={{ display: 'flex', justifyContent: 'center' }}>
          <JunieLogo variant="mark" size={88} />
        </div>

        <div className="space-y-2">
          <h1 className="font-display-bold" style={{ fontSize: 56, color: '#F0925E', letterSpacing: '-0.02em' }}>
            404
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-soft)' }}>
            Deze pagina bestaat niet.
          </p>
        </div>

        <Link
          to="/"
          className="btn btn-primary press"
          style={{ maxWidth: 240, margin: '0 auto', fontSize: 15 }}
        >
          Terug naar home
        </Link>
      </div>
    </div>
  );
}