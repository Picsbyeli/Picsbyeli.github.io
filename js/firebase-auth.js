// Firebase Configuration and Authentication System
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    query, 
    orderBy, 
    limit, 
    getDocs,
    addDoc,
    where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQE2mo6RNgwG-WaooCpoZjQ9Z8G2MHvx8",
    authDomain: "profile-9e9f9.firebaseapp.com",
    databaseURL: "https://profile-9e9f9-default-rtdb.firebaseio.com",
    projectId: "profile-9e9f9",
    storageBucket: "profile-9e9f9.firebasestorage.app",
    messagingSenderId: "610449223815",
    appId: "1:610449223815:web:3cdb864b4314d2b901c822",
    measurementId: "G-7R4Z3ZSZ67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Global user state
let currentUser = null;
let userProfile = null;
let authInitialized = false;

/**
 * User Authentication Class
 */
class GameAuth {
    constructor(firebaseApp) {
        this.auth = auth;
        this.db = db;
        this.storage = storage;
        this.initAuthListener();
    }

    // Initialize authentication state listener
    initAuthListener() {
        onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                currentUser = user;
                await this.loadUserProfile(user.uid);
                this.onUserLogin(user);
            } else {
                currentUser = null;
                userProfile = null;
                this.onUserLogout();
            }
            authInitialized = true;
        });
    }

    // Register new user
    async register(email, password, username) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Update display name
            await updateProfile(user, {
                displayName: username
            });

            // Create user profile in Firestore
            await setDoc(doc(this.db, 'users', user.uid), {
                username: username,
                email: email,
                score: 0,
                gamesPlayed: 0,
                wins: 0,
                createdAt: new Date(),
                settings: {
                    theme: 'light',
                    language: 'en',
                    fontSize: 'medium',
                    fontFamily: 'sans',
                    profilePicUrl: null
                }
            });

            return { success: true, user: user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout user
    async logout() {
        try {
            await signOut(this.auth);
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Load user profile from Firestore
    async loadUserProfile(uid) {
        try {
            const docSnap = await getDoc(doc(this.db, 'users', uid));
            if (docSnap.exists()) {
                userProfile = docSnap.data();
                return userProfile;
            } else {
                console.log('No user profile found');
                return null;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    }

    // Update user profile
    async updateUserProfile(updates) {
        if (!currentUser) return { success: false, error: 'No user logged in' };

        try {
            await updateDoc(doc(this.db, 'users', currentUser.uid), updates);
            userProfile = { ...userProfile, ...updates };
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }
    }

    // Upload profile picture
    async uploadProfilePicture(file) {
        if (!currentUser) return { success: false, error: 'No user logged in' };

        try {
            const storageRef = ref(this.storage, `profilePictures/${currentUser.uid}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            await this.updateUserProfile({
                'settings.profilePicUrl': downloadURL
            });

            return { success: true, url: downloadURL };
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            return { success: false, error: error.message };
        }
    }

    // Submit game score
    async submitScore(gameName, score) {
        if (!currentUser || !userProfile) {
            return { success: false, error: 'Please log in to save your score' };
        }

        try {
            // Add score to scores collection
            await addDoc(collection(this.db, 'scores'), {
                userId: currentUser.uid,
                username: userProfile.username,
                gameName: gameName,
                score: score,
                timestamp: new Date()
            });

            // Update user stats
            const newGamesPlayed = (userProfile.gamesPlayed || 0) + 1;
            const newTotalScore = (userProfile.score || 0) + score;

            await this.updateUserProfile({
                gamesPlayed: newGamesPlayed,
                score: newTotalScore
            });

            return { success: true };
        } catch (error) {
            console.error('Error submitting score:', error);
            return { success: false, error: error.message };
        }
    }

    // Get leaderboard for a specific game
    async getGameLeaderboard(gameName, limitCount = 10) {
        try {
            const q = query(
                collection(this.db, 'scores'),
                where('gameName', '==', gameName),
                orderBy('score', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const leaderboard = [];
            
            querySnapshot.forEach((doc) => {
                leaderboard.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return leaderboard;
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            return [];
        }
    }

    // Get global leaderboard (top users by total score)
    async getGlobalLeaderboard(limitCount = 10) {
        try {
            const q = query(
                collection(this.db, 'users'),
                orderBy('score', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const leaderboard = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                leaderboard.push({
                    uid: doc.id,
                    username: data.username,
                    score: data.score || 0,
                    gamesPlayed: data.gamesPlayed || 0,
                    wins: data.wins || 0
                });
            });

            return leaderboard;
        } catch (error) {
            console.error('Error getting global leaderboard:', error);
            return [];
        }
    }

    // Event handlers (to be overridden)
    onUserLogin(user) {
        console.log('User logged in:', user.email);
        // Override this method to handle login events
    }

    onUserLogout() {
        console.log('User logged out');
        // Override this method to handle logout events
    }

    // Get current user info
    getCurrentUser() {
        return {
            user: currentUser,
            profile: userProfile,
            isLoggedIn: !!currentUser
        };
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!currentUser;
    }

    // Wait for authentication state to be initialized
    waitForAuthInit() {
        return new Promise((resolve) => {
            if (authInitialized) {
                resolve();
            } else {
                const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                    unsubscribe();
                    resolve();
                });
            }
        });
    }
}

// Create global auth instance
const gameAuth = new GameAuth();

// Export for global use
window.gameAuth = gameAuth;
window.getCurrentUser = () => gameAuth.getCurrentUser();
window.isUserLoggedIn = () => gameAuth.isLoggedIn();

export default gameAuth;