import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js';
import Form from '@components/Form';
import useLogin from '@hooks/auth/useLogin.jsx';
import '@styles/form.css';
import logo from '../assets/logo_muni.jpg'; 



const Login = () => {
    const navigate = useNavigate();
    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange
    } = useLogin();

    const loginSubmit = async (data) => {
        try {
            const response = await login(data);
            if (response.status === 'Success') {
                navigate('/home');
            } else if (response.status === 'Client error') {
                errorData(response.details);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="container">
            <img src={logo} alt="Escudo" className="logo" />
            <Form
                title="Iniciar sesión"
                fields={[
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "ejemplo@dominio.cl",
                        fieldType: 'input',
                        type: "email",
                        required: true,
                        minLength: 5,
                        maxLength: 30,
                        errorMessageData: errorEmail,
                        validate: {
                            emailDomain: (value) => value.includes('@'),
                        },
                        onChange: (e) => handleInputChange('email', e.target.value),
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        fieldType: 'input',
                        type: "password",
                        required: true,
                        minLength: 7,
                        maxLength: 26,
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                        errorMessageData: errorPassword,
                        onChange: (e) => handleInputChange('password', e.target.value)
                    },
                ]}
                buttonText="Iniciar sesión"
                onSubmit={loginSubmit}
                footerContent={
                    <p>
                        ¿No tienes cuenta?, <a href="/register">¡Regístrate aquí!</a>
                    </p>
                }
            />
        </main>
    );
};

export default Login;