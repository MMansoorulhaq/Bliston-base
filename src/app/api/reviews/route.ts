import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
        let placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '0x4870994f1f4e2ce9:0x8f0b36a3a9dba76a';

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        // If Place ID is in hex format (0x...:0x...), we need to search by name first
        if (placeId.startsWith('0x')) {
            console.log('Place ID is in hex format, searching by name...');

            // Search for the place by name to get the proper Place ID
            const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=247+Cars+Willenhall&inputtype=textquery&fields=place_id,name&key=${apiKey}`;

            const searchResponse = await fetch(searchUrl);
            const searchData = await searchResponse.json();

            if (searchData.status === 'OK' && searchData.candidates && searchData.candidates.length > 0) {
                placeId = searchData.candidates[0].place_id;
                console.log('Found Place ID:', placeId);
            } else {
                console.error('Could not find place:', searchData.status);
                return NextResponse.json({ error: 'Place not found' }, { status: 404 });
            }
        }

        // Now fetch the place details with the correct Place ID
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            console.error('Google API error:', data.status, data.error_message);
            return NextResponse.json({ error: data.error_message || data.status }, { status: 400 });
        }

        // Filter for 4-5 star reviews
        const filteredReviews = (data.result?.reviews || []).filter(
            (review: any) => review.rating >= 4
        );

        console.log(`✅ Successfully fetched ${filteredReviews.length} reviews (4-5 stars)`);

        return NextResponse.json({
            reviews: filteredReviews,
            rating: data.result?.rating,
            total: data.result?.user_ratings_total,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
