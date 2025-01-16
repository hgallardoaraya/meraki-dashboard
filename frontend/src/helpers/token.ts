import { jwtDecode } from "jwt-decode";

export const decodeToken = (token:string) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;  
  } catch (error) {
    return null;  
  }
};

export function isTokenExpired(token: string) {
  // Dividir el token en sus tres partes
  const parts = token.split('.');
  if (parts.length !== 3) {
      throw new Error('El token JWT no es válido');
  }

  // Decodificar el payload (parte del medio)
  const payloadBase64 = parts[1];
  const payloadJson = atob(payloadBase64); // Decodificar Base64
  const payload = JSON.parse(payloadJson); // Parsear a JSON

  // Verificar si el campo `exp` existe
  if (!payload.exp) {
      throw new Error('El token no contiene un campo de expiración');
  }

  // Obtener el tiempo actual en segundos
  const currentTime = Math.floor(Date.now() / 1000);

  // Comparar `exp` con el tiempo actual
  return payload.exp < currentTime; // Retorna true si el token ha expirado
}
