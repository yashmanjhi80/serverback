// Application Configuration
// This file contains all the configuration settings for the application

export const APP_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: "https://gam-63b1249c8e8b.herokuapp.com",
    ENDPOINTS: {
      LOGIN: "/login",
      REGISTER: "/register",
      BALANCE: "/balance",
      LAUNCH_GAME: "/launch-game",
      CREATE_PAYMENT: "/create-payment",
      WITHDRAW: "/withdraw",
      TRANSACTIONS: "/api/transactions", // For future implementation
    },
    TIMEOUT: 15000, // 15 seconds
  },

  // Payment Configuration
  PAYMENT: {
    MIN_DEPOSIT: 100,
    MAX_DEPOSIT: 50000,
    MIN_WITHDRAWAL: 50,
    MAX_WITHDRAWAL: 25000,
    SUPPORTED_METHODS: {
      DEPOSIT: ["upi", "netbanking", "card"],
      WITHDRAWAL: ["bank", "upi"],
    },
  },

  // Game Configuration
  GAME: {
    MIN_BALANCE_TO_PLAY: 10,
    DEFAULT_LANGUAGE: "en-US",
    HTML5_ENABLED: "1",
    TYPES: {
      SLOTS: "SL",
      FISHING: "FH",
      CARDS: "CB",
      OTHERS: "OT",
    },
  },

  // UI Configuration
  UI: {
    BANNER_AUTO_SLIDE_INTERVAL: 4000, // 4 seconds
    WELCOME_NOTIFICATION_DURATION: 3000, // 3 seconds
    LOADING_PROGRESS_INTERVAL: 200, // 200ms
    HORIZONTAL_BREAKPOINT: 568, // pixels
  },

  // Audio Configuration
  AUDIO: {
    BACKGROUND_MUSIC_VOLUME: 0.3,
    ASSETS: {
      BACKGROUND_MUSIC:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/casino-164235-cUCEIuEsbFSxYHamVkEpJSyuc2VQmu.mp3",
      BUTTON_CLICK:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/button-305770-eNhAQVf6x4rLNcVuRBQ2Lq0WU30exr.mp3",
    },
  },

  // Storage Keys
  STORAGE_KEYS: {
    USER_CREDENTIALS: "userCredentials",
    USER_DATA: "userData",
    HAS_SHOWN_WELCOME: "hasShownWelcome",
  },

  // Validation Rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 12,
    },
    PASSWORD: {
      MIN_LENGTH: 6,
    },
  },

  // App Information
  APP_INFO: {
    NAME: "Mystic Realm",
    TAGLINE: "Enter the Adventure",
    COPYRIGHT: "© 2024 Mystic Realm. All rights reserved.",
    VERSION: "1.0.0",
  },

  // Feature Flags
  FEATURES: {
    MUSIC_ENABLED: true,
    HORIZONTAL_LAYOUT: true,
    WELCOME_NOTIFICATION: true,
    BALANCE_REFRESH: true,
    GAME_LOADING_ANIMATION: true,
  },

  // Environment
  ENV: {
    DEVELOPMENT: process.env.NODE_ENV === "development",
    PRODUCTION: process.env.NODE_ENV === "production",
  },
} as const

// Type definitions for better TypeScript support
export type ApiEndpoint = keyof typeof APP_CONFIG.API.ENDPOINTS
export type PaymentMethod =
  | (typeof APP_CONFIG.PAYMENT.SUPPORTED_METHODS.DEPOSIT)[number]
  | (typeof APP_CONFIG.PAYMENT.SUPPORTED_METHODS.WITHDRAWAL)[number]
export type GameType = (typeof APP_CONFIG.GAME.TYPES)[keyof typeof APP_CONFIG.GAME.TYPES]
export type StorageKey = (typeof APP_CONFIG.STORAGE_KEYS)[keyof typeof APP_CONFIG.STORAGE_KEYS]

// Helper functions
export const getApiUrl = (endpoint: ApiEndpoint): string => {
  return `${APP_CONFIG.API.BASE_URL}${APP_CONFIG.API.ENDPOINTS[endpoint]}`
}

export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG.FEATURES): boolean => {
  return APP_CONFIG.FEATURES[feature]
}

export const getStorageKey = (key: keyof typeof APP_CONFIG.STORAGE_KEYS): string => {
  return APP_CONFIG.STORAGE_KEYS[key]
}

// Export default for easier imports
export default APP_CONFIG
