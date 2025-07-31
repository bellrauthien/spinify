import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  common: {
    appName: 'Spinify',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success!',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    save: 'Save',
    delete: 'Delete',
    search: 'Search',
    language: 'Language'
  },
  auth: {
    loginWithSpotify: 'Login with Spotify',
    logout: 'Logout from Spotify',
    connectWithSpotify: 'Connect with Spotify',
    success: 'Authentication Successful',
    successMessage: 'You have successfully connected your Spotify account',
    error: 'Authentication Error',
    errorMessage: 'There was an error connecting to Spotify',
    errorInitiating: 'Error initiating Spotify login',
    errorNoUserId: 'No user ID received from authentication',
    redirecting: 'Redirecting to home page...',
    requiredToAddSongs: 'Please login with Spotify to add songs to playlists'
  },
  home: {
    welcome: 'Welcome to Spinify',
    tagline: 'Join a jam session and add your favorite songs',
    joinJam: 'Join a Jam',
    scanQR: 'Scan QR Code',
    enterCode: 'Enter Jam Code',
    jamCodePlaceholder: 'Enter your jam code here',
    createJam: 'Create a New Jam'
  },
  scan: {
    title: 'Scan QR Code',
    instruction: 'Point your camera at the Jam QR code',
    permissionDenied: 'Camera permission denied',
    tryAgain: 'Try Again',
    enterManually: 'Enter Code Manually'
  },
  playlist: {
    title: 'Playlist',
    nowPlaying: 'Now Playing',
    upNext: 'Up Next',
    addSongs: 'Add Songs',
    empty: 'No songs in the playlist yet',
    joinedAs: 'Joined as'
  },
  addSongs: {
    title: 'Add Songs',
    searchPlaceholder: 'Search for songs, artists, or albums',
    noResults: 'No results found',
    addToPlaylist: 'Add to Playlist',
    songAdded: 'Song added to playlist!',
    freeSongsRemaining: 'Free songs remaining: {{count}}',
    paymentRequired: 'You\'ve used your 3 free songs',
    goToPay: 'Pay €1 for 3 more songs'
  },
  payment: {
    title: 'Payment',
    description: 'Pay €1 to add 3 more songs',
    cardDetails: 'Card Details',
    cardNumber: 'Card Number',
    cardholderName: 'Cardholder Name',
    expiryDate: 'Expiry Date',
    cvv: 'CVV',
    payNow: 'Pay Now',
    paymentSuccess: 'Payment successful!',
    returnToPlaylist: 'Return to Playlist',
    mockPayment: 'This is a mock payment for demonstration purposes'
  }
};

// Spanish translations
const esTranslations = {
  common: {
    appName: 'Spinify',
    loading: 'Cargando...',
    error: 'Ha ocurrido un error',
    success: '¡Éxito!',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    back: 'Atrás',
    next: 'Siguiente',
    save: 'Guardar',
    delete: 'Eliminar',
    search: 'Buscar',
    language: 'Idioma'
  },
  auth: {
    loginWithSpotify: 'Iniciar sesión con Spotify',
    logout: 'Cerrar sesión de Spotify',
    connectWithSpotify: 'Conectar con Spotify',
    success: 'Autenticación Exitosa',
    successMessage: 'Has conectado tu cuenta de Spotify correctamente',
    error: 'Error de Autenticación',
    errorMessage: 'Hubo un error al conectar con Spotify',
    errorInitiating: 'Error al iniciar sesión con Spotify',
    errorNoUserId: 'No se recibió ID de usuario de la autenticación',
    redirecting: 'Redirigiendo a la página principal...',
    requiredToAddSongs: 'Por favor, inicia sesión con Spotify para añadir canciones a las listas'
  },
  home: {
    welcome: 'Bienvenido a Spinify',
    tagline: 'Únete a una sesión y añade tus canciones favoritas',
    joinJam: 'Unirse a una Jam',
    scanQR: 'Escanear Código QR',
    enterCode: 'Introducir Código',
    jamCodePlaceholder: 'Introduce tu código aquí',
    createJam: 'Crear una Nueva Jam'
  },
  scan: {
    title: 'Escanear Código QR',
    instruction: 'Apunta tu cámara al código QR de la Jam',
    permissionDenied: 'Permiso de cámara denegado',
    tryAgain: 'Intentar de nuevo',
    enterManually: 'Introducir Código Manualmente'
  },
  playlist: {
    title: 'Lista de Reproducción',
    nowPlaying: 'Reproduciendo ahora',
    upNext: 'A continuación',
    addSongs: 'Añadir Canciones',
    empty: 'No hay canciones en la lista todavía',
    joinedAs: 'Unido como'
  },
  addSongs: {
    title: 'Añadir Canciones',
    searchPlaceholder: 'Buscar canciones, artistas o álbumes',
    noResults: 'No se encontraron resultados',
    addToPlaylist: 'Añadir a la Lista',
    songAdded: '¡Canción añadida a la lista!',
    freeSongsRemaining: 'Canciones gratis restantes: {{count}}',
    paymentRequired: 'Has usado tus 3 canciones gratis',
    goToPay: 'Paga €1 por 3 canciones más'
  },
  payment: {
    title: 'Pago',
    description: 'Paga €1 para añadir 3 canciones más',
    cardDetails: 'Detalles de la Tarjeta',
    cardNumber: 'Número de Tarjeta',
    cardholderName: 'Nombre del Titular',
    expiryDate: 'Fecha de Caducidad',
    cvv: 'CVV',
    payNow: 'Pagar Ahora',
    paymentSuccess: '¡Pago realizado con éxito!',
    returnToPlaylist: 'Volver a la Lista',
    mockPayment: 'Este es un pago simulado con fines de demostración'
  }
};

// Configure i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations }
    },
    lng: localStorage.getItem('spinify_language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;
