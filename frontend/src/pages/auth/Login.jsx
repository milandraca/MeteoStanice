import { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../constants';
import { AuthService } from '../../services/AuthService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const success = await AuthService.login(email, password);
            
            if (success) {
                navigate(RouteNames.HOME);
            } else {
                setError('Neuspješna prijava. Provjerite email i lozinku.');
            }
        } catch (err) {
            setError('Došlo je do greške prilikom prijave.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Prijava</Card.Title>
                    
                    {error && <div className="alert alert-danger">{error}</div>}
                    
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
                            />
                        </Form.Group>
                        
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Prijava u tijeku...' : 'Prijavi se'}
                            </Button>
                        </div>
                    </Form>
                    
                    <div className="text-center mt-3">
                        <p>Nemate račun? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            navigate(RouteNames.REGISTER);
                        }}>Registrirajte se</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
