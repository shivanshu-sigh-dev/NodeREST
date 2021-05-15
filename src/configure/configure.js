// Staging environment details
const stagingDetails = {
    port: 3000,
    envName: 'staging'
};

// Prod environment details
const prodDetails = {
    port: 5000,
    envName: 'production'
};

// Select the env on the basis of command line args
const EnvDetails = process.env.NODE_ENV == 'production' ? prodDetails : stagingDetails;

// Export the selected env details
export default EnvDetails;