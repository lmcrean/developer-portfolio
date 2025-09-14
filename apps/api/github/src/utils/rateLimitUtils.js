"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
exports.retryApiCall = retryApiCall;
exports.checkRateLimit = checkRateLimit;
exports.logRateLimitStatus = logRateLimitStatus;
exports.estimateApiCalls = estimateApiCalls;
exports.ensureSufficientRateLimit = ensureSufficientRateLimit;
// Helper function to add delay between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.delay = delay;
// Helper function to retry API calls with exponential backoff
async function retryApiCall(apiCall, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        }
        catch (error) {
            // Check if it's a rate limiting error based on GitHub's rate limit documentation
            if (error.status === 403 && error.response?.headers?.['x-ratelimit-remaining'] === '0') {
                if (attempt === maxRetries) {
                    throw new Error(`GitHub API rate limit exceeded after ${maxRetries} attempts`);
                }
                const resetTime = error.response?.headers?.['x-ratelimit-reset'];
                const waitTime = resetTime ? (parseInt(resetTime) * 1000 - Date.now()) : baseDelay * Math.pow(2, attempt - 1);
                console.log(`🚨 Rate limit hit, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
                await (0, exports.delay)(Math.min(waitTime, 30000)); // Cap at 30 seconds
                continue;
            }
            // Handle secondary rate limits (429 status)
            if (error.status === 429) {
                if (attempt === maxRetries) {
                    throw new Error(`GitHub API secondary rate limit exceeded after ${maxRetries} attempts`);
                }
                const retryAfter = error.response?.headers?.['retry-after'];
                const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt - 1);
                console.log(`⚠️ Secondary rate limit hit, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`);
                await (0, exports.delay)(Math.min(waitTime, 60000)); // Cap at 60 seconds for secondary limits
                continue;
            }
            // For other errors, only retry if it's not the last attempt
            if (attempt === maxRetries) {
                throw error;
            }
            const waitTime = baseDelay * Math.pow(2, attempt - 1);
            console.log(`💫 API call failed, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`);
            await (0, exports.delay)(waitTime);
        }
    }
    throw new Error('Max retries exceeded');
}
// Helper function to check remaining rate limit using GitHub's rate limit API
async function checkRateLimit(octokit) {
    try {
        const { data } = await octokit.rest.rateLimit.get();
        return {
            remaining: data.rate.remaining,
            limit: data.rate.limit,
            resetTime: new Date(data.rate.reset * 1000),
            used: data.rate.used
        };
    }
    catch (error) {
        console.warn('⚠️ Failed to check rate limit:', error);
        // Return optimistic defaults based on authenticated user limits
        // This allows the API to continue functioning even if rate limit checks fail
        return {
            remaining: 4000, // Assume we have plenty of calls available
            limit: 5000, // Authenticated user limit
            resetTime: new Date(Date.now() + 60 * 60 * 1000), // Reset in 1 hour
            used: 1000
        };
    }
}
// Helper function to log rate limit status with visual indicators
function logRateLimitStatus(remaining, limit, operation) {
    const percentage = Math.round((remaining / limit) * 100);
    const emoji = percentage > 50 ? '✅' : percentage > 20 ? '⚠️' : '🚨';
    console.log(`${emoji} Rate limit for ${operation}: ${remaining}/${limit} (${percentage}%) remaining`);
    if (percentage < 10) {
        console.warn(`🚨 CRITICAL: Only ${remaining} API calls remaining!`);
    }
    else if (percentage < 25) {
        console.warn(`⚠️ LOW: Only ${percentage}% of API calls remaining`);
    }
}
// Helper function to estimate API calls needed for an operation
function estimateApiCalls(operation, itemCount = 1) {
    switch (operation) {
        case 'pull_requests':
            // Search API (1) + PR details (itemCount) + Repo details (itemCount, but often cached)
            return 1 + (itemCount * 2);
        case 'pull_request_details':
            // PR details (1) + Comments (1)
            return 2;
        default:
            return 1;
    }
}
// Helper function to check if we have enough API calls remaining
async function ensureSufficientRateLimit(octokit, operation, itemCount = 1) {
    try {
        const estimatedCalls = estimateApiCalls(operation, itemCount);
        const rateLimit = await checkRateLimit(octokit);
        logRateLimitStatus(rateLimit.remaining, rateLimit.limit, operation);
        if (rateLimit.remaining < estimatedCalls) {
            const resetTime = rateLimit.resetTime.toLocaleTimeString();
            console.warn(`🚨 Insufficient API calls: need ${estimatedCalls}, have ${rateLimit.remaining}. Resets at ${resetTime}`);
            return false;
        }
        return true;
    }
    catch (error) {
        console.warn('⚠️ Failed to check rate limit for operation, proceeding with caution:', error);
        // If rate limit check fails, proceed with the operation
        // This prevents rate limit check failures from blocking API functionality
        return true;
    }
}
