import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { FirebaseApp } from './firebase';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {

    private auth: admin.auth.Auth;

    constructor(private firebaseApp: FirebaseApp) {
        this.auth = firebaseApp.getAuth();
    }

    use(req: Request, res: Response, next: () => void) {
        const token = req.headers.authorization;
        console.log('token', token);
        if (token != null && token != '') {
          this.auth
            .verifyIdToken(token.replace('Bearer ', ''))
            .then(async (decodedToken) => {
              req['user'] = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                roles: (decodedToken.roles || []),
                type: decodedToken.type,
              };
              console.log('decodedToken', {
                uid: decodedToken.uid,
                email: decodedToken.email,
                roles: (decodedToken.roles || []),
                type: decodedToken.type,
                });
              next();
            })
            .catch(() => {
                FirebaseAuthMiddleware.accessDenied(req.url, res);
            });
        } else {
            FirebaseAuthMiddleware.accessDenied(req.url, res);
        }
    }


    private static accessDenied(url: string, res: Response) {
    res.status(401).send({
        statusCode: 401,
        timestamp: new Date().toISOString(),
        path: url,
        message: 'Access Denied',
    });
    }
}
