import React, { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { getNotificacoes } from '../api/ClienteService';

interface NotificationData {
    id: number;
    idCliente: number;
    titulo: string;
    conteudo: string;
    lida: boolean;
}

interface NotificationContextType {
    notifications: NotificationData[];
    setNotifications: Dispatch<SetStateAction<NotificationData[]>>;
    newNotifications: boolean;
    setNewNotifications: Dispatch<SetStateAction<boolean>>;
    markNotificationsAsRead: () => void; 
}

// Ajuste aqui: defina o valor inicial do contexto com a tipagem correta    
const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    setNotifications: () => { },
    newNotifications: false,
    setNewNotifications: () => { },
    markNotificationsAsRead: () => { } 
});

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [newNotifications, setNewNotifications] = useState(false);

    const markNotificationsAsRead = () => {
        const updatedNotifications = notifications.map(notificacao => ({ ...notificacao, lida: true }));
        setNotifications(updatedNotifications);
        setNewNotifications(false); // Atualizar o estado para não haver novas notificações
    };
    
    useEffect(() => {
        const carregarNotificacoes = async () => {
            try {
                const response = await getNotificacoes();
                if (response) {
                    const hasUnreadNotification = response.some(notificacao => !notificacao.lida);
                    setNotifications(response);
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

        carregarNotificacoes();
    }, []);


    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, newNotifications, setNewNotifications, markNotificationsAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

const useNotifications = () => useContext(NotificationContext);

export { NotificationProvider, useNotifications };
