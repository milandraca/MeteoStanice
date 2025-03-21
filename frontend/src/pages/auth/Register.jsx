import { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../constants';
import { AuthService } from '../../services/AuthService';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Lozinke se ne podudaraju.');
            return;
        }
        
        setLoading(true);
        
        try {
            const success = await AuthService.register(email, password);
            
            if (success) {
                // Show success message
                setSuccess('Registracija uspješna! Preusmjeravanje na prijavu...');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate(RouteNames.LOGIN);
                }, 2000);
            } else {
                setError('Neuspješna registracija. Pokušajte ponovno.');
            }
        } catch (err) {
            setError('Došlo je do greške prilikom registracije.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Registracija</Card.Title>
                    
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="Unesite email"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Lozinka</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                placeholder="Unesite lozinku"
                                minLength="6"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Potvrdite lozinku</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                placeholder="Potvrdite lozinku"
                                minLength="6"
                            />
                        </Form.Group>
                        
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Registracija u tijeku...' : 'Registriraj se'}
                            </Button>
                        </div>
                    </Form>
                    
                    <div className="text-center mt-3">
                        <p>Već imate račun? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            navigate(RouteNames.LOGIN);
                        }}>Prijavite se</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
