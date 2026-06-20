import React from "react";

/**
 * Error Boundary — catches JavaScript errors in child component tree
 * and displays a friendly fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            background: "#f4f1ea",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              background: "#fff",
              border: "1px solid #e7e2d6",
              borderRadius: "18px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 12px 40px rgba(20,30,25,.1)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "rgba(192,73,47,.12)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px",
                fontSize: "24px",
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "20px",
                color: "#1f231e",
                marginBottom: "8px",
              }}
            >
              Terjadi Kesalahan
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#8a8578",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              Aplikasi mengalami error yang tidak terduga. Silakan coba muat ulang
              halaman. Jika masalah berlanjut, hubungi tim teknis.
            </p>
            {this.state.error && (
              <details
                style={{
                  textAlign: "left",
                  background: "#faf8f2",
                  border: "1px solid #e7e2d6",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "16px",
                  fontSize: "12px",
                  color: "#c0492f",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  Detail Error
                </summary>
                <pre
                  style={{
                    marginTop: "8px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "1px solid #e7e2d6",
                  background: "#fff",
                  color: "#1f231e",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#11704f",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(17,112,79,.25)",
                }}
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
