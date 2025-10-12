import { useState } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import { addUpcomingGame } from '../../services/upcomingGamesService';
import styles from '../../css/AddToUpcomingModal.module.css';

export default function AddToUpcomingModal({ show, onHide, game, onSuccess }) {
    const [releaseDate, setReleaseDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!releaseDate) {
            alert('Please select a release date');
            return;
        }

        setLoading(true);
        try {
            await addUpcomingGame(game, releaseDate);
            alert('Game added to Most Anticipated!');
            setReleaseDate('');
            onHide();
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className={styles.offcanvas}>
            <Offcanvas.Header closeButton className={styles.header}>
                <Offcanvas.Title className={styles.title}>
                    <i className="fas fa-calendar-plus me-2"></i>
                    Add to Most Anticipated
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className={styles.body}>
                <div className={styles.gameInfo}>
                    {game.background_image && (
                        <img 
                            src={game.background_image} 
                            alt={game.name} 
                            className={styles.gameImage}
                        />
                    )}
                    <h3 className={styles.gameName}>{game.name}</h3>
                </div>

                <Form onSubmit={handleSubmit} className={styles.form}>
                    <Form.Group className="mb-4">
                        <Form.Label className={styles.label}>
                            <i className="fas fa-calendar me-2"></i>
                            Release Date
                        </Form.Label>
                        <Form.Control
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                            className={styles.input}
                        />
                        <Form.Text className={styles.helpText}>
                            Select the expected release date for this game
                        </Form.Text>
                    </Form.Group>

                    <div className={styles.actions}>
                        <Button 
                            variant="secondary" 
                            onClick={onHide}
                            className={styles.cancelBtn}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus me-2"></i>
                                    Add to Most Anticipated
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
}