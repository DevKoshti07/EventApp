const isProduction = false; // Change this to true for production

const Config = {
    REACT_NATIVE_SERVER_API_FULL_URL: isProduction
        ? 'http://3.7.81.243/projects/plie-api/public/api'
        : 'http://3.7.81.243/projects/plie-api/public/api',

    REACT_NATIVE_SERVER_API_KEY: '', // any ApiKey Here!

    // API Endpoints
    ENDPOINTS: {
        LOGIN: '/login',
        EVENTS_LISTING: '/events-listing',
    }
};

const getFullApiUrl = (endpoint: string | undefined): string | undefined => {
    if (endpoint && endpoint.length > 0) {
        return Config.REACT_NATIVE_SERVER_API_FULL_URL + endpoint;
    }
};

export { Config, getFullApiUrl };