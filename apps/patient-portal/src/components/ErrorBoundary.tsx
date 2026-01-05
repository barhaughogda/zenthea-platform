import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback?: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */ }> {
  render() {
    return this.props.children;
  }
}
