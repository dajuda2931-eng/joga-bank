import React from 'react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4">
                        <h2 className="text-2xl font-bold text-red-600">Ops! Algo deu errado.</h2>
                        <p className="text-gray-600">Ocorreu um erro inesperado na aplicação.</p>
                        <div className="bg-gray-100 p-4 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-gray-700">
                            {this.state.error?.toString()}
                        </div>
                        <Button onClick={() => window.location.reload()}>
                            Recarregar Página
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
