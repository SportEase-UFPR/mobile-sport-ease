import React, { createContext, useState, useContext, useEffect } from 'react';
import ClienteService, { getNotificacoes } from '../api/ClienteService';

const NotificationContext = createContext({});

// Provider do contexto
const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState(true);

    useEffect(() => {
        const carregarNotificacoes = async () => {
            const response = await getNotificacoes()
            const hasUnreadNotification = response.some(notificacao => notificacao.lida === false); // Verifica se há alguma notificação não lida
            if (response && hasUnreadNotification) {
                setNotifications(response);
                setNewNotifications(true)
            } else {
                setNotifications(response);
                setNewNotifications(false)
            }
        }

        carregarNotificacoes();
    }, [])



    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotifications = () => useContext(NotificationContext);

export { NotificationProvider, useNotifications };
