import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UniHall ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/login";
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
            background: "#F7FAF9",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "44px", marginBottom: "12px" }}>⚠️</div>
            <div
              style={{ fontSize: "18px", fontWeight: 700, color: "#1F2D3D" }}
            >
              Something went wrong
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "#6B7280",
                marginTop: "4px",
                marginBottom: "16px",
              }}
            >
              Please try again, or return to login.
            </div>
            <button
              onClick={this.handleReload}
              style={{
                background: "linear-gradient(135deg, #0E5E54, #159895)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
