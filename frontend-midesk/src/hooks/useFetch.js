// src/hooks/useFetch.js
import axios from "axios";
import { toast } from "react-toastify";

export function useFetch() {

    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}) => {
        const loadingToast = toast.loading("Procesando solicitud...");

        try {
            // 1. Configuración base
            const options = {
                method,
                url,
                headers: {
                    ...headers, // Mantenemos headers extra (como Authorization)
                }
            };

            // 2. CORRECCIÓN: Solo agregamos Body y Content-Type si hay datos
            // Esto evita que DELETE o GET fallen por enviar headers vacíos
            if (data && Object.keys(data).length > 0) {
                options.headers["Content-Type"] = "application/json";
                options.data = data;
            }

            // 3. Hacemos la petición
            const response = await axios(options);

            toast.dismiss(loadingToast);
            
            // A veces el backend no manda 'msg', validamos para que no salga 'undefined'
            if (response?.data?.msg) {
                toast.success(response.data.msg);
            }
            
            return response?.data;

        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Error en useFetch:", error);
            
            // Manejo seguro del mensaje de error
            const errorMsg = error.response?.data?.msg || "Error de conexión con el servidor";
            toast.error(errorMsg);
            
            // Lanzamos el error para que el componente sepa que falló
            throw error; 
        }
    }
    
    return fetchDataBackend;
}