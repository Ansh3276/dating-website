import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        let newSocket = null;
        
        if (authLoading) return;
        
        const initSocketConnection = async () => {
            if (user && user.id) {
                try {
                    newSocket = io('http://localhost:5000', {
                        withCredentials: true
                    });
                    
                    newSocket.on('connect', () => {
                        console.log('Socket connected:', newSocket.id);
                        newSocket.emit('register', user.id);
                    });

                    newSocket.on('onlineUsers', (users) => {
                        setOnlineUsers(users);
                    });

                    newSocket.on('receiveLike', (data) => {
                       console.log('Received Like notification!', data);
                    });

                    newSocket.on('newMatch', (data) => {
                        console.log('New Match notification!', data);
                     });

                    setSocket(newSocket);
                } catch (err) {
                    console.error('Socket init error:', err);
                }
            }
        };

        if (user) {
            initSocketConnection();
        } else {
            setSocket(null);
        }

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [user, authLoading]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
