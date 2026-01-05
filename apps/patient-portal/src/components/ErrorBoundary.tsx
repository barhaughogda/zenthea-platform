/* eslint-disable */
import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback?: any }> {
  render() {
    return this.props.children;
  }
}
