'use client';

interface UserCardProps {
    name: string;
    rating: number;
}

export default function UserCard({ name, rating }: UserCardProps) {
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${i <= rating ? '' : 'empty'}`}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="user-card">
            <h3 className="user-name">{name}</h3>
            <div className="star-rating">
                {renderStars()}
            </div>
        </div>
    );
}
