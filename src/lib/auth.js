import jwt from 'jsonwebtoken';

export function getAuthUser(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Devuelve { id, username }
    } catch (error) {
        return null;
    }
}