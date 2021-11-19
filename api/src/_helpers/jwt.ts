import expressJwt from 'express-jwt';
import config from '../config';

export function jwt() {
    const { secret } = config;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/authenticate'
        ]
    });
}
