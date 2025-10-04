import { useEffect, useState } from 'react';
import styles from '../css/GameStats.module.css';

export default function GamesStats() {
    const finalStats = {
        games: 319500,
        ratings: 26300000,
        reviews: 8110000,
        added: 44200000
    };

    const colors = {
        games: '#107C10',      // Verde Xbox
        ratings: '#003791',    // Blu PlayStation
        reviews: '#E60012',    // Rosso Nintendo
        added: '#FF6600'       // Arancione PC
    };

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 2000;
        const increment = 1 / 60;
        const intervalTime = duration / 60;

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= 1) {
                    clearInterval(timer);
                    return 1;
                }
                return next;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, []);

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
        return num;
    };

    const stats = [
        { key: 'games', label: 'Games', color: colors.games },
        { key: 'ratings', label: 'Ratings', color: colors.ratings },
        { key: 'reviews', label: 'Reviews', color: colors.reviews },
        { key: 'added', label: 'Played', color: colors.added }
    ];

    return (
        <div className='container-md my-4'>
            <div className="row text-center">
                {stats.map(stat => (
                    <div key={stat.key} className="col-3 mb-3">
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>
                                <span 
                                    className={styles.statColorBox}
                                    style={{ backgroundColor: stat.color }}
                                ></span>
                                {stat.label}
                            </span>
                            <h3 className={styles.statValue}>
                                {formatNumber(Math.floor(finalStats[stat.key] * progress))}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}