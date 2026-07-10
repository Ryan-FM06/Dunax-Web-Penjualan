const AUTH_KEYS = ['isLogin', 'currentUser'];

export const saveAuth = (data, rememberMe) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;

    storage.setItem('isLogin', 'true');
    storage.setItem('currentUser', JSON.stringify(data));

    // bersihin storage yang satunya biar nggak dobel/bentrok
    other.removeItem('isLogin');
    other.removeItem('currentUser');
};

export const getAuth = () => {
    const source = localStorage.getItem('isLogin')
        ? localStorage
        : sessionStorage;

    const isLogin = source.getItem('isLogin') === 'true';
    const currentUserRaw = source.getItem('currentUser');

    return {
        isLogin,
        currentUser: currentUserRaw ? JSON.parse(currentUserRaw) : null
    };
};

export const clearAuth = () => {
    AUTH_KEYS.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
};