// Example Component
// This demonstrates how components can be organized in subfolders

export class ExampleComponent {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        // Component initialization logic
        console.log('Example component initialized');
    }

    render() {
        // Component rendering logic
        return '<div>Example Component</div>';
    }
}

// Export as default if preferred
// export default ExampleComponent;

