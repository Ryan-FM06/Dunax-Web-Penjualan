const Notification = {

    show(message, type = 'success', duration = 2000) {

        const oldNotif = document.getElementById('notification-toast');
        if (oldNotif) {
            oldNotif.remove();
        }

        const toast = document.createElement('div');
        toast.id = 'notification-toast';

        toast.textContent = message;

        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '14px 22px';
        toast.style.borderRadius = '8px';
        toast.style.color = '#fff';
        toast.style.fontWeight = '600';
        toast.style.zIndex = '9999';
        toast.style.transition = '.3s';
        toast.style.opacity = '1';
        toast.style.boxShadow = '0 6px 15px rgba(0,0,0,.2)';

        toast.style.background =
            type === 'success'
                ? '#1b713f'
                : '#e74c3c';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';

            setTimeout(() => {
                toast.remove();
            }, 300);

        }, duration);

    }

};

export default Notification;