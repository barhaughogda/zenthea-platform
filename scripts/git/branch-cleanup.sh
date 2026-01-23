#!/bin/bash
#
# This script identifies branches for cleanup based on the repository's branch hygiene policy.
# By default, it runs in DRY RUN mode and only prints suggested commands.
#
# Policies:
# 1. KEEP: main, safety/*
# 2. CANDIDATES: Any other branch merged into origin/main.
# 3. MANUAL REVIEW: Any branch NOT merged into origin/main.

set -e

# --- Configuration ---
KEEP_PATTERN="^(main|safety/.*)$"
DATE=$(date +%Y-%m-%d)
APPLY_LOCAL=false
FORCE_PATTERN=""

# --- Usage ---
usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --apply           Delete merged LOCAL branches (requires confirmation)"
    echo "  --force <pattern> Print force-delete commands for branches matching pattern"
    echo "  --help            Show this help message"
    exit 1
}

# --- Parse Arguments ---
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --apply) APPLY_LOCAL=true ;;
        --force) FORCE_PATTERN="$2"; shift ;;
        --help) usage ;;
        *) echo "Unknown parameter: $1"; usage ;;
    esac
    shift
done

# --- Pre-flight Checks ---
if ! git diff-index --quiet HEAD --; then
    echo "ERROR: Working tree is not clean. Please commit or stash changes."
    exit 1
fi

echo "--- Syncing with origin ---"
git fetch --prune origin

# --- Gather Branches ---
MERGED_LOCAL=$(git branch --merged origin/main | sed 's/^[ *]*//')
ALL_LOCAL=$(git branch | sed 's/^[ *]*//')

# --- Logic ---
echo ""
echo "=== BRANCH ANALYSIS ==="

KEEP_LIST=()
CANDIDATE_LIST=()
MANUAL_REVIEW_LIST=()

for branch in $ALL_LOCAL; do
    if [[ $branch =~ $KEEP_PATTERN ]]; then
        KEEP_LIST+=("$branch")
    elif echo "$MERGED_LOCAL" | grep -q "^$branch$"; then
        CANDIDATE_LIST+=("$branch")
    else
        MANUAL_REVIEW_LIST+=("$branch")
    fi
done

echo "KEEP (Protected):"
for b in "${KEEP_LIST[@]}"; do echo "  - $b"; done

echo ""
echo "CANDIDATES (Merged into origin/main):"
if [ ${#CANDIDATE_LIST[@]} -eq 0 ]; then
    echo "  (None)"
else
    for b in "${CANDIDATE_LIST[@]}"; do echo "  - $b"; done
fi

echo ""
echo "MANUAL REVIEW REQUIRED (Not merged):"
if [ ${#MANUAL_REVIEW_LIST[@]} -eq 0 ]; then
    echo "  (None)"
else
    for b in "${MANUAL_REVIEW_LIST[@]}"; do echo "  - $b"; done
fi

echo ""
echo "=== SUGGESTED COMMANDS ==="

if [ ${#CANDIDATE_LIST[@]} -gt 0 ]; then
    echo "# To archive and delete candidates:"
    for b in "${CANDIDATE_LIST[@]}"; do
        # Only suggest archive tags for governance/docs
        if [[ $b =~ ^(governance|docs)/ ]]; then
            TAG_NAME="archive/${b//\//-}-$DATE"
            echo "git tag $TAG_NAME $b && git push origin $TAG_NAME"
        fi
        echo "git branch -d $b"
        echo "git push origin --delete $b 2>/dev/null || true # Remote delete (if exists)"
    done
else
    echo "# No candidates for deletion found."
fi

if [ -n "$FORCE_PATTERN" ]; then
    echo ""
    echo "# FORCE DELETE COMMANDS (Matching: $FORCE_PATTERN):"
    for b in $ALL_LOCAL; do
        if [[ $b =~ $FORCE_PATTERN ]] && [[ ! $b =~ $KEEP_PATTERN ]]; then
            echo "git branch -D $b"
            echo "git push origin --delete $b"
        fi
    done
fi

# --- Execution (Optional) ---
if [ "$APPLY_LOCAL" = true ] && [ ${#CANDIDATE_LIST[@]} -gt 0 ]; then
    echo ""
    read -p "Are you sure you want to delete the ${#CANDIDATE_LIST[@]} merged LOCAL branches listed above? (y/N) " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        for b in "${CANDIDATE_LIST[@]}"; do
            git branch -d "$b"
        done
        echo "Local cleanup complete."
    else
        echo "Cleanup cancelled."
    fi
elif [ "$APPLY_LOCAL" = true ]; then
    echo "Nothing to apply."
fi

exit 0
