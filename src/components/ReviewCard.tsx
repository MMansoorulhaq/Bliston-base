'use client';

interface ReviewCardProps {
    text: string;
}

export default function ReviewCard({ text }: ReviewCardProps) {
    return (
        <div className="review-card">
            <p className="review-text">{text}</p>
        </div>
    );
}
