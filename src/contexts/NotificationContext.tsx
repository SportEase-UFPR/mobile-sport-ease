import React, { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { getNotificacoes } from '../api/ClienteService';

interface NotificationData {
    id: number;
    idCliente: number;
    titulo: string;
    conteudo: string;
    lida: boolean;
    dataHora: Date;
}

interface NotificationContextType {
    notifications: NotificationData[];
    setNotifications: Dispatch<SetStateAction<NotificationData[]>>;
    newNotifications: boolean;
    setNewNotifications: Dispatch<SetStateAction<boolean>>;
    markNotificationsAsRead: () => void;
    loadNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    setNotifications: () => { },
    newNotifications: false,
    setNewNotifications: () => { },
    markNotificationsAsRead: () => { },
    loadNotifications: () => { }
});

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [newNotifications, setNewNotifications] = useState(false);

    const markNotificationsAsRead = () => {
        const updatedNotifications = notifications.map(notificacao => ({ ...notificacao, lida: true }));
        setNotifications(updatedNotifications);
        setNewNotifications(false);
    };

    const loadNotifications = async() => {
        carregarNotificacoes();
    }

    const carregarNotificacoes = async () => {
        try {
            const response = await getNotificacoes();
            if (response) {
                const sortedNotifications = response.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
                const hasUnreadNotification = sortedNotifications.some(notificacao => !notificacao.lida);
                setNotifications(sortedNotifications);
                setNewNotifications(hasUnreadNotification);
            } else {
                setNotifications([]);
                setNewNotifications(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNotifications([]);
                setNewNotifications(false);
            } else {
                console.error("Erro ao carregar notificações:", error);
            }
        }
    };

    useEffect(() => {
        carregarNotificacoes();
        const cronCarregarNotificacoes = () => {
            carregarNotificacoes();
        };
        const intervalId = setInterval(cronCarregarNotificacoes, 300000);
        return () => clearInterval(intervalId);
    }, []);


    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, newNotifications, setNewNotifications, markNotificationsAsRead, loadNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotifications = () => useContext(NotificationContext);

export { NotificationProvider, useNotifications };
