import { create } from 'zustand';
import { db, auth, rtdb } from './firebase/config';
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, getDocs, serverTimestamp } from 'firebase/firestore';
import { ref, set as rtdbSet, onDisconnect } from 'firebase/database';
import type { Fleet, FleetMember } from './types';

interface FleetState {
    currentFleet: Fleet | null;
    members: FleetMember[];
    loading: boolean;
    error: string | null;

    // Actions
    createFleet: (name: string, description?: string) => Promise<void>;
    joinFleet: (fleetId: string) => Promise<void>;
    leaveFleet: () => Promise<void>;
    fetchFleet: (fleetId: string) => Promise<void>;
    syncPresence: (fleetId: string) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
    currentFleet: null,
    members: [],
    loading: false,
    error: null,

    createFleet: async (name, description) => {
        const user = auth.currentUser;
        if (!user) return;

        set({ loading: true });
        try {
            const fleetId = `fleet_${Date.now()}`;
            const fleetData: Fleet = {
                id: fleetId,
                name,
                description,
                ownerId: user.uid,
                members: [user.uid],
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, 'fleets', fleetId), fleetData);

            // Add member record
            const memberData: FleetMember = {
                uid: user.uid,
                displayName: user.displayName || 'Anonymous Operative',
                photoURL: user.photoURL || undefined,
                role: 'commander',
                joinedAt: serverTimestamp()
            };
            await setDoc(doc(db, 'fleets', fleetId, 'members', user.uid), memberData);

            // Update user's fleet reference
            await updateDoc(doc(db, 'users', user.uid), {
                currentFleetId: fleetId
            });

            set({ currentFleet: fleetData, loading: false });
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    joinFleet: async (fleetId) => {
        const user = auth.currentUser;
        if (!user) return;

        set({ loading: true });
        try {
            const fleetRef = doc(db, 'fleets', fleetId);
            const fleetSnap = await getDoc(fleetRef);

            if (!fleetSnap.exists()) throw new Error("Fleet not found");

            await updateDoc(fleetRef, {
                members: arrayUnion(user.uid)
            });

            const memberData: FleetMember = {
                uid: user.uid,
                displayName: user.displayName || 'Anonymous Operative',
                photoURL: user.photoURL || undefined,
                role: 'operative',
                joinedAt: serverTimestamp()
            };
            await setDoc(doc(db, 'fleets', fleetId, 'members', user.uid), memberData);

            await updateDoc(doc(db, 'users', user.uid), {
                currentFleetId: fleetId
            });

            set({ currentFleet: fleetSnap.data() as Fleet, loading: false });
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    leaveFleet: async () => {
        // Implementation for future
    },

    fetchFleet: async (fleetId) => {
        set({ loading: true });
        try {
            const fleetSnap = await getDoc(doc(db, 'fleets', fleetId));
            if (fleetSnap.exists()) {
                set({ currentFleet: fleetSnap.data() as Fleet });

                // Fetch members
                const mSnap = await getDocs(collection(db, 'fleets', fleetId, 'members'));
                const members = mSnap.docs.map(d => d.data() as FleetMember);
                set({ members, loading: false });
            }
        } catch (e: any) {
            set({ error: e.message, loading: false });
        }
    },

    syncPresence: (fleetId) => {
        const user = auth.currentUser;
        if (!user || !rtdb) return;

        const presenceRef = ref(rtdb, `fleets/${fleetId}/presence/${user.uid}`);

        // Update presence on connect
        rtdbSet(presenceRef, {
            displayName: user.displayName || 'Operative',
            status: 'online',
            lastActive: Date.now()
        });

        // Remove on disconnect
        onDisconnect(presenceRef).remove();
    }
}));
