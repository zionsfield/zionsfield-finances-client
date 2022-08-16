import React, { Component } from "react";

interface Props {
  dashboard: () => string;
}

export default class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log("====================================");
    console.log(error, errorInfo);
    console.log("====================================");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-3 text-center">
          <h1 className="text-2xl font-semibold pb-3">Something went wrong</h1>
          <p>Please refresh the page</p>
        </div>
      );
    }
    return this.props.children;
  }
}
