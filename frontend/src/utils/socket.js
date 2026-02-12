import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;
let socketEnabled = true; // Can be disabled if connection keeps failing

export const initSocket = (token) => {
    if (!token) return null;

    // Disconnect existing socket
    if (socket) {
        socket.disconnect();
        socket = null;
    }

    // Don't attempt connection if previously disabled
    if (!socketEnabled) return null;

    try {
        socket = io(SOCKET_URL, {
            auth: { token },
            reconnection: true,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
            reconnectionAttempts: 5,
            timeout: 10000,
            transports: ['websocket', 'polling'],
        });

        socket.on('connect', () => {
            console.log('🔌 Socket connected:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.warn('⚠️ Socket connection error:', error.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
        });

        // If we fail all reconnection attempts, disable socket
        socket.io.on('reconnect_failed', () => {
            console.warn('⚠️ Socket reconnection failed. Falling back to polling.');
            socketEnabled = false;
            socket = null;
        });

        return socket;
    } catch (err) {
        console.warn('⚠️ Socket initialization failed:', err.message);
        return null;
    }
};

/**
 * Get the current socket instance.
 * Returns null if socket is not initialized or unavailable.
 * Components should handle null gracefully (use polling fallback).
 */
export const getSocket = () => {
    return socket;
};

/**
 * Check if socket is currently connected and active.
 */
export const isSocketConnected = () => {
    return socket?.connected ?? false;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
