#!/bin/bash

# check-data-staleness.sh
# Smart data staleness checker that detects external PR activity
# and determines if a data update is needed

set -e

# Configuration
PROD_URL="https://lauriecrean-free-38256.web.app"
GITHUB_API_BASE="https://api.github.com"
EXCLUDED_USER="lmcrean"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}🔍 $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if force update is requested
check_force_update() {
    if [ "$1" = "true" ]; then
        log_info "Force update requested"
        echo "needs_update=true"
        echo "reason=force_requested"
        exit 0
    fi
}

# Get current production metadata
get_current_metadata() {
    log_info "Fetching current production metadata..."
    
    if curl -s -f "$PROD_URL/pr-metadata.json" > current_metadata.json; then
        LAST_GENERATED=$(cat current_metadata.json | jq -r '.last_generated // empty')
        
        if [ -n "$LAST_GENERATED" ]; then
            LAST_EPOCH=$(date -d "$LAST_GENERATED" +%s 2>/dev/null || echo "0")
            CURRENT_EPOCH=$(date +%s)
            DATA_AGE_HOURS=$(( (CURRENT_EPOCH - LAST_EPOCH) / 3600 ))
            log_info "Current data age: $DATA_AGE_HOURS hours"
            echo "$DATA_AGE_HOURS"
        else
            log_warning "Could not parse last_generated timestamp"
            echo "999"
        fi
    else
        log_warning "Could not fetch current metadata from $PROD_URL"
        echo "999"
    fi
}

# Check if data is very stale (24+ hours)
check_very_stale() {
    local age_hours=$1
    
    if [ "$age_hours" -gt 24 ]; then
        log_warning "Data is very stale (${age_hours}h), forcing update"
        echo "needs_update=true"
        echo "reason=very_stale"
        exit 0
    fi
}

# Build GitHub API search URL with since parameter
build_search_url() {
    local last_generated="$1"
    local base_query="type:pr+author:-${EXCLUDED_USER}+is:public+sort:updated-desc"
    
    if [ -n "$last_generated" ]; then
        # Convert to ISO format for GitHub API
        SINCE_ISO=$(date -d "$last_generated" --iso-8601 2>/dev/null || echo "")
        if [ -n "$SINCE_ISO" ]; then
            log_info "Checking for PRs since: $SINCE_ISO"
            echo "${GITHUB_API_BASE}/search/issues?q=${base_query}&since=${SINCE_ISO}&per_page=10"
        else
            echo "${GITHUB_API_BASE}/search/issues?q=${base_query}&per_page=10"
        fi
    else
        echo "${GITHUB_API_BASE}/search/issues?q=${base_query}&per_page=10"
    fi
}

# Check for new external pull requests
check_external_activity() {
    local github_token="$1"
    local last_generated="$2"
    
    log_info "Checking for new external pull requests..."
    
    # Build API URL
    local api_url=$(build_search_url "$last_generated")
    
    # Fetch recent pull requests from GitHub API
    if curl -s -H "Authorization: token $github_token" \
            -H "Accept: application/vnd.github.v3+json" \
            "$api_url" > recent_prs.json; then
        
        # Count external PRs (excluding our user)
        local external_pr_count=$(cat recent_prs.json | jq "[.items[] | select(.user.login != \"$EXCLUDED_USER\")] | length")
        
        log_info "Found $external_pr_count external PRs since last update"
        
        if [ "$external_pr_count" -gt 0 ]; then
            log_success "New external activity detected, updating data..."
            echo "needs_update=true"
            echo "reason=new_external_activity"
            echo "external_pr_count=$external_pr_count"
            exit 0
        else
            log_info "No new external PRs found"
            echo "$external_pr_count"
        fi
    else
        log_error "Could not fetch recent PRs from GitHub API"
        echo "-1"  # Error indicator
    fi
}

# Determine update decision based on staleness and activity
determine_update_decision() {
    local data_age_hours="$1"
    local external_activity_result="$2"
    
    if [ "$external_activity_result" = "-1" ]; then
        # API error - fall back to time-based logic
        log_warning "API error, checking data age only"
        if [ "$data_age_hours" -gt 6 ]; then
            echo "needs_update=true"
            echo "reason=api_error_data_stale"
        else
            echo "needs_update=false"
            echo "reason=api_error_data_fresh"
        fi
    else
        # No external activity found
        log_info "No external activity detected"
        
        # Only update if data is moderately stale (12+ hours)
        if [ "$data_age_hours" -gt 12 ]; then
            log_warning "No external activity but data is moderately stale (${data_age_hours}h), updating"
            echo "needs_update=true"
            echo "reason=moderately_stale_no_external"
        else
            log_success "No external activity and data is fresh enough, skipping update"
            echo "needs_update=false"
            echo "reason=no_external_activity_data_fresh"
        fi
    fi
}

# Main function
main() {
    local force_update="${1:-false}"
    local github_token="${2:-$GITHUB_TOKEN}"
    
    # Validate required parameters
    if [ -z "$github_token" ]; then
        log_error "GitHub token is required (set GITHUB_TOKEN or pass as second argument)"
        exit 1
    fi
    
    log_info "Starting smart data staleness check..."
    
    # Step 1: Check for force update
    check_force_update "$force_update"
    
    # Step 2: Get current metadata and calculate age
    local last_generated=""
    if [ -f "current_metadata.json" ]; then
        last_generated=$(cat current_metadata.json | jq -r '.last_generated // empty')
    fi
    
    local data_age_hours=$(get_current_metadata)
    
    # Step 3: Check if data is very stale
    check_very_stale "$data_age_hours"
    
    # Step 4: Check for external activity
    local external_activity_result=$(check_external_activity "$github_token" "$last_generated")
    
    # Step 5: Make final decision
    determine_update_decision "$data_age_hours" "$external_activity_result"
}

# Cleanup temporary files on exit
cleanup() {
    rm -f current_metadata.json recent_prs.json
}
trap cleanup EXIT

# Run main function with all arguments
main "$@"