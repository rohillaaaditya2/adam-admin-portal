'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  moduleName: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[AdminModuleErrorBoundary] Error in module "${this.props.moduleName}":`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="panel" style={{ padding: 32, border: '1.5px solid #fecaca', background: '#fef2f2', borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: 10, background: '#fee2e2', borderRadius: 10, color: '#dc2626' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <span className="eyebrow tiny" style={{ color: '#dc2626' }}>MODULE ERROR ISOLATION</span>
              <h3 style={{ margin: '2px 0 0', fontSize: 18, color: '#991b1b' }}>
                Error in Module: {this.props.moduleName}
              </h3>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 16px', lineHeight: 1.5 }}>
            An unexpected error occurred inside this module. The rest of the Admin Panel is running normally.
          </p>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #fca5a5', marginBottom: 18, fontSize: 12, fontFamily: 'monospace', color: '#b91c1c' }}>
            {this.state.error?.message || 'Unknown module error'}
          </div>
          <button
            className="btn btn-shaadi btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={this.handleRetry}
          >
            <RotateCcw size={14} /> Retry {this.props.moduleName}
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
