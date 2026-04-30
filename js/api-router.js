export class ApiRouter {
    constructor(basePath = '/api') {
        this.basePath = basePath;
    }

    async get(endpoint) {
        try {
            const url = `${this.basePath}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('ApiRouter failed to fetch:', error);
            return null;
        }
    }
}

// Singleton instance for easy usage
export const api = new ApiRouter();
