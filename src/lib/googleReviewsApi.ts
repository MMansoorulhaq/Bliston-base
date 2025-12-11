/**
 * Google Reviews API Integration
 * Fetches REAL reviews dynamically via Next.js API route (server-side)
 * This avoids CORS issues by proxying through our backend
 */

export interface GoogleReview {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    profile_photo_url?: string;
}

/**
 * Fetches REAL Google reviews dynamically from our API route
 * @returns Array of reviews with 4-5 star ratings only
 */
export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
    try {
        console.log('🔄 Fetching real reviews from Google Places API...');

        // Call our Next.js API route (server-side, no CORS issues)
        const response = await fetch('/api/reviews', {
            next: { revalidate: 1800 } // Cache for 30 minutes
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ API error:', error);
            return [];
        }

        const data = await response.json();

        console.log('✅ Successfully fetched reviews from Google!');
        console.log(`📊 Total reviews: ${data.total || 0}`);
        console.log(`⭐ Average rating: ${data.rating || 0}`);
        console.log(`✨ Showing ${data.reviews?.length || 0} reviews with 4-5 stars`);

        return data.reviews || [];
    } catch (error) {
        console.error('❌ Error fetching Google reviews:', error);
        return [];
    }
}

/**
 * Format timestamp to relative time (e.g., "2 days ago")
 */
export function formatReviewTime(timestamp: number): string {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const days = Math.floor(diff / 86400);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}
