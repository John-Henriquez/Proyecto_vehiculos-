import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function RejectPopup({ show, setShow, data, action }) {
    const solicitudData = data && Array.isArray(data) && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        console.log("RejectPopUp - formData", formData);
        action(formData);
    };
    
    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} />
                        </button>
                        <Form
                            title="Rechazar Solicitud"
                            fields={[
                                {
                                    label: 'Estado',
                                    name: 'estado',
                                    defaultValue: 'rechazada',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    disabled: true,
                                },
                                {
                                    label: 'Observaciones',
                                    name: 'observaciones',
                                    defaultValue: solicitudData.observaciones || '',
                                    placeholder: 'Escribe las observaciones aquí...',
                                    fieldType: 'textarea',
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Rechazar Solicitud"
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
