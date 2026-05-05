import React from "react";

export default class LunaErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[LunaErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-dvh flex flex-col items-center justify-center px-8"
          style={{ background: "#0B0B14", color: "var(--text)" }}
        >
          <p className="eyebrow" style={{ marginBottom: 12 }}>IETS MISGEGAAN</p>
          <h1 className="font-display text-center" style={{ fontSize: 28, marginBottom: 12 }}>
            Even geen Luna.
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
            Vernieuw de pagina. Als het blijft, probeer later opnieuw.
          </p>
          <button
            type="button"
            className="btn btn-primary press mt-8"
            style={{ fontSize: 15 }}
            onClick={() => window.location.reload()}
          >
            Vernieuwen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
