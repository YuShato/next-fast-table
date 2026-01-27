'use client';
import { Component, ReactNode } from 'react';

class ChunkErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    if (error.name === 'ChunkLoadError') {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error: Error) {
    if (error.name === 'ChunkLoadError') {
      // Reload the page to get fresh chunks
      window.location.reload();
    }
  }

  render() {
    return this.props.children;
  }
}

export default ChunkErrorBoundary;