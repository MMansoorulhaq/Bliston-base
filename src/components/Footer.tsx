'use client';

import { Carousel } from 'react-bootstrap';
import ReviewCard from './ReviewCard';

// Sample reviews data for 247 Cars
// In production, this would be fetched from Google Places API
const reviews = [
    {
        id: 1,
        name: 'Taimoor Ali',
        rating: 4,
        text: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        rating: 5,
        text: 'Excellent service! The car was in perfect condition and the staff were very professional. Would definitely recommend 247 Cars to anyone looking for reliable transportation.',
    },
    {
        id: 3,
        name: 'Mohammed Ahmed',
        rating: 5,
        text: 'Best car rental experience I\'ve had in Walsall. Quick, efficient, and great value for money. The team went above and beyond to ensure I had everything I needed.',
    },
    {
        id: 4,
        name: 'Emily Roberts',
        rating: 4,
        text: 'Very satisfied with the service. The booking process was smooth and the car was clean and well-maintained. Will definitely use 247 Cars again for my next trip.',
    },
    {
        id: 5,
        name: 'David Thompson',
        rating: 5,
        text: 'Outstanding customer service and quality vehicles. The staff were friendly and helpful throughout the entire rental period. Highly recommended!',
    },
];

export default function Footer() {
    const sample = reviews[0];
    return (
        <footer className="footer-section">
            <div className="container">
                <h2 className="footer-title">What Our Customers Say</h2>

                <div className="reviews-carousel">
                    <Carousel
                        interval={5000}
                        pause="hover"
                        indicators={true}
                        controls={true}
                    >
                        {reviews.map((review) => (
                            <Carousel.Item key={review.id}>
                                <div className="d-flex justify-content-center px-3 px-md-5 pb-5">
                                    <div className="col-12 col-md-8 col-lg-6">
                                        <ReviewCard text={review.text} />
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>

                {/* Review strip matching the design: left pill + right message */}
                <div className="footer-testimonial-bar">
                    <div className="review-strip">
                        <div className="reviewer-profile">
                            <div className="avatar-dot" aria-hidden="true"></div>
                            <div className="left-content">
                                <div className="pill-name">{sample.name}</div>
                                <div className="pill-stars">{Array.from({ length: sample.rating }).map((_, i) => '★').join('')}</div>
                            </div>
                        </div>

                        <div className="testimonial-text">
                            <div className="testimonial">{sample.text}</div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="mb-2" style={{ color: '#9ca3af', fontSize: '14px' }}>
                        © 2025 247 Cars Willenhall. All rights reserved.
                    </p>
                    <a
                        href="https://www.google.com/search?gs_ssp=eJzj4tFP1zeszLAsKczKSjJgtFI1qDCxMDewtDRJM0wzSTVKTrW0MqiwSDNIMjZLNE60TElKNDdL9BI2MjFXSE4sKlYoz8zJSc3LSMzJAQAlTxZp&q=247+cars+willenhall&oq=247+cars+willenhall"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: '#2E2F90', fontSize: '14px' }}
                    >
                        View all reviews on Google
                    </a>
                </div>
            </div>
        </footer>
    );
}
