import React from 'react';
import { useNotificationState } from '../context/NotificationContext';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

const icons: Record<string, React.ReactElement> = {
    success: <FiCheckCircle />,
    error: <FiXCircle />,
    info: <FiInfo />,
};

const colors: Record<string, string> = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
};

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotificationState();

    if (!notifications.length) {
        return null;
    }

    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm space-y-3">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`${colors[notification.type]} text-white p-4 rounded-lg shadow-2xl flex items-center border-l-4 animate-fade-in-right`}
                    role="alert"
                >
                    <div className="mr-3 text-2xl">{icons[notification.type]}</div>
                    <div className="flex-grow font-medium">{notification.message}</div>
                    <button 
                        onClick={() => removeNotification(notification.id)} 
                        className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="Close notification"
                    >
                        <FiX size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
