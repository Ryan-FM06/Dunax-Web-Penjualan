import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { handleRegister } from './Register-presenter.js';

const RegisterView = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [status, setStatus] = React.useState({
        type: '',
        message: ''
    });

    const onSubmit = (e) => {
        e.preventDefault();

        if (formData.password.length < 8) {
            setStatus({
                type: 'error',
                message: 'Password minimal 8 karakter.'
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setStatus({
                type: 'error',
                message: 'Konfirmasi password tidak sesuai.'
            });
            return;
        }

        handleRegister(
            formData.name,
            formData.email,
            formData.password,
        );
    };

    return React.createElement(
        'div',
        { className: 'auth-page' },

        React.createElement(
            'div',
            { className: 'auth-card' },

            [

                React.createElement(
                    'h2',
                    { key: 'h2' },
                    'Daftar Akun Baru'
                ),

                React.createElement(
                    'form',
                    {
                        key: 'form',
                        onSubmit
                    },
                    [

                        React.createElement('input', {
                            key: 'name',
                            type: 'text',
                            placeholder: 'Nama Lengkap',
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                        }),

                        React.createElement('input', {
                            key: 'email',
                            type: 'email',
                            placeholder: 'Email',
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                        }),

                        React.createElement('input', {
                            key: 'password',
                            type: 'password',
                            placeholder: 'Password',
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                        }),

                        React.createElement('input', {
                            key: 'confirmPassword',
                            type: 'password',
                            placeholder: 'Konfirmasi Password',
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value
                                })
                        }),

                        React.createElement(
                            'small',
                            {
                                key: 'info',
                                style: {
                                    display: 'block',
                                    marginTop: '-8px',
                                    marginBottom: '12px',
                                    color: '#777',
                                    fontSize: '12px'
                                }
                            },
                            'Minimal 8 karakter dan gunakan kombinasi huruf.'
                        ),

                        React.createElement(
                            'button',
                            {
                                key: 'btn',
                                type: 'submit'
                            },
                            'Register'
                        )

                    ]
                ),

                status.message &&
                React.createElement(
                    'p',
                    {
                        key: 'msg',
                        style: {
                            color:
                                status.type === 'error'
                                    ? '#e74c3c'
                                    : '#2ecc71',
                            marginTop: '10px',
                            textAlign: 'center'
                        }
                    },
                    status.message
                ),

                React.createElement(
                    'div',
                    {
                        key: 'footer',
                        className: 'auth-footer'
                    },
                    [
                        'Sudah punya akun? ',
                        React.createElement(
                            'a',
                            {
                                key: 'a',
                                href: '#/login',
                                className: 'link-accent'
                            },
                            'Login di sini'
                        )
                    ]
                )

            ]
        )
    );
};

const Register = {
    async render() {
        return '<div id="register-root"></div>';
    },
    async afterRender() {
        const root = ReactDOM.createRoot(document.getElementById('register-root'));
        root.render(React.createElement(RegisterView));
    }
};

export default Register;