import {Injectable} from "@nestjs/common";
import * as firebase from "firebase-admin";

@Injectable()
export class FirebaseApp {
    private firebaseApp: firebase.app.App;

    constructor() {

        const firebaseConfig = {
            type: process.env.FIREBASE_TYPE,
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        };
        console.log(firebaseConfig);
        this.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert({...firebaseConfig}),
        });
    }

    getAuth = (): firebase.auth.Auth => {
        return this.firebaseApp.auth();
    }

    firestore = (): firebase.firestore.Firestore => {
        return this.firebaseApp.firestore();
    }
}