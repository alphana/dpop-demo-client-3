// src/services/auth.ts
import {IndexedDbDPoPStore, User, UserManager, WebStorageStateStore} from 'oidc-client-ts';
import axios from "axios";

// Utility function to convert ArrayBuffer to Base64


// Custom UserManager with DPoP support
class DPoPUserManager extends UserManager {
    private keyPair: CryptoKeyPair | null = null;

    constructor(settings: any) {
        super(settings);
        this.initializeDPoPKeys();
    }

    private async initializeDPoPKeys() {
        this.keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'ECDSA',
                namedCurve: 'P-256',
            },
            true,
            ['sign', 'verify']
        );
    }


}




const settings = {
    authority: 'http://localhost:8180/realms/dpop-poc',
    client_id: 'dpop-client-pub',
    redirect_uri: 'http://localhost:3000/callback',
    response_type: 'code',
    scope: 'openid profile email',
    post_logout_redirect_uri: 'http://localhost:3000',
    silent_redirect_uri: 'http://localhost:3000/silent-renew',
    userStore: new WebStorageStateStore({store: window.localStorage}),
    dpop: {
        bind_authorization_code: true,
        store: new IndexedDbDPoPStore()
    }
};

class AuthService {
    private userManager: DPoPUserManager;

    constructor() {
        this.userManager = new DPoPUserManager(settings);

        // Add event listeners for debugging
        this.userManager.events.addUserLoaded((user) => {
            console.log('User loaded:', user);
        });
        this.userManager.events.addSilentRenewError((error) => {
            console.error('Silent renew error:', error);
        });
        this.userManager.events.addAccessTokenExpiring(() => {
            console.log('Access token expiring');
        });
    }

    async login(): Promise<void> {
        try {
            await this.userManager.signinRedirect();
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async handleCallback(): Promise<User | undefined> {
        try {
            return this.userManager.signinCallback();
        } catch (error) {
            console.error('Callback handling failed:', error);
            throw error;
        }
    }

    async getUser(): Promise<User | null> {
        try {
            return await this.userManager.getUser();
        } catch (error) {
            console.error('Get user failed:', error);
            return null;
        }
    }

    async logout(): Promise<void> {
        try {
            await this.userManager.signoutRedirect();
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }


    async sendAuthenticatedRequest(requestMethod: string, requestUrl: string, requestData?: any) {
        const user = await this.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const dpopToken = await this.userManager.dpopProof(requestUrl, user, requestMethod);
        const authzHeaders = {
            "Content-Type": "application/json",
            'Authorization': `DPoP ${user.access_token}`,
            'DPoP': dpopToken ? dpopToken.toString() : "nil",
        }

        return axios({
            method: requestMethod,
            url: requestUrl,
            withCredentials: false,
            headers: authzHeaders,
            data: requestData ? JSON.stringify(requestData) : undefined
        });
    }

}

export const authService = new AuthService();