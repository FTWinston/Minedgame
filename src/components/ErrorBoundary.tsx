import { Component } from 'react';

interface Props {
    fallback: React.ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Ensures that any errors don't break the whole app.
 * If an error occurs in a child of this component,
 * this component will render its fallback,
 * but the rest of the app will not be affected.
 */
export class ErrorBoundary extends Component<React.PropsWithChildren<Props>, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: unknown) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
        // Optionally log the error here.
        // This already shows in console.error in development mode.
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return this.props.fallback;
    }
}
