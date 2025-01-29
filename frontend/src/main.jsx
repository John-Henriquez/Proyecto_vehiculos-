import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Solicitudes from '@pages/Solicitudes'; 
import Registro from '@pages/Registro';
import CrearSolicitud from '@pages/CrearSolicitud';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';
import Vehiculos from './pages/Vehiculos';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/applications', 
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
            <Solicitudes  /> 
          </ProtectedRoute>
        ),
      },
      {
        path: '/records', 
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Registro  /> 
          </ProtectedRoute>
        ),
      },
      {
        path: '/vehicles', 
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Vehiculos  /> 
          </ProtectedRoute>
        ),
      },
      {
        path: '/add-application', 
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'usuario']}>
            <CrearSolicitud  /> 
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
