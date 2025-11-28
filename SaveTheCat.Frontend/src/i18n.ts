import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      toolbar: {
        projects: "Gestionar Proyectos",
        characters: "Personajes",
        locations: "Locaciones",
        userMenu: {
          changePassword: "Cambiar Contraseña",
          logout: "Cerrar Sesión",
          deleteAccount: "Eliminar Cuenta",
          confirmDelete: "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
          accountDeleted: "Cuenta eliminada exitosamente."
        }
      },
      beatSheet: {
        title: "TÍTULO DEL PROYECTO:",
        logline: "LOGLINE:",
        genre: "GÉNERO:",
        date: "FECHA:",
        desc_title: "El nombre oficial de tu guion.",
        desc_logline: "Tu historia resumida en una sola frase atractiva.",
        desc_genre: "El tipo de historia y sus reglas (ej: Un monstruo en casa).",
        desc_date: "Fecha de la última modificación.",
        beats: {
          openingImage: "1. Imagen de apertura (1)",
          themeStated: "2. Declaración del tema (5)",
          setUp: "3. Planteamiento (1-10)",
          catalyst: "4. Catalizador (12)",
          debate: "5. Debate (12-25)",
          breakIntoTwo: "6. Transición al Acto 2 (25)",
          bStory: "7. Trama B (30)",
          funAndGames: "8. Juegos y risas (30-35)",
          midpoint: "9. Punto intermedio (55)",
          badGuysCloseIn: "10. Los malos estrechan el cerco (55-75)",
          allIsLost: "11. Todo está perdido (75)",
          darkNightOfTheSoul: "12. Noche oscura del alma (75-85)",
          breakIntoThree: "13. Transición al Acto 3 (85)",
          finale: "14. Final (85-110)",
          finalImage: "15. Imagen de cierre (110)"
        },
        beatDescriptions: {
          openingImage: "Establece el tono, el estilo y el 'antes' del protagonista.",
          themeStated: "Alguien (no el prota) plantea la pregunta o lección moral de la historia.",
          setUp: "Presenta al héroe, su mundo (tesis) y lo que le falta en su vida.",
          catalyst: "El evento que cambia la vida del héroe para siempre. No hay vuelta atrás.",
          debate: "¿Debe ir el héroe? ¿Se atreve? Duda antes de entrar al nuevo mundo.",
          breakIntoTwo: "El héroe decide actuar y cruza el umbral hacia el mundo invertido (antítesis).",
          bStory: "La historia de amor o amistad que porta el tema moral.",
          funAndGames: "La promesa de la premisa. Escenas icónicas del género.",
          midpoint: "Falsa victoria o falsa derrota. Las apuestas suben. El reloj empieza a correr.",
          badGuysCloseIn: "Las fuerzas antagonistas atacan interna y externamente.",
          allIsLost: "Derrota aparente. Olor a muerte. El héroe pierde lo que creía querer.",
          darkNightOfTheSoul: "El héroe se lamenta y luego halla la solución (la verdad).",
          breakIntoThree: "El héroe, habiendo aprendido el tema, decide luchar. Síntesis.",
          finale: "El héroe aplica la lección aprendida para vencer al malo y cambiar el mundo.",
          finalImage: "El espejo de la imagen de apertura. Muestra cuánto ha cambiado el héroe."
        }
      },
      board: {
        act1: "ACTO I\n(pp. 1-25)",
        act2a: "ACTO II\n(pp. 25-55)",
        act2b: "ACTO II\n(pp. 55-85)",
        act3: "ACTO III\n(pp. 85-110)",
        newScene: "NUEVA ESCENA"
      },
      modals: {
        projects: "Gestionar Proyectos",
        characters: "Gestionar Personajes",
        locations: "Gestionar Locaciones",
        add: "Añadir",
        save: "Guardar",
        cancel: "Cancelar",
        close: "Cerrar",
        delete: "Eliminar",
        edit: "Editar",
        select: "Seleccionar",
        confirmDeleteTitle: "¿Estás seguro?",
        confirmDeleteMsg: "¿Estás seguro de que quieres eliminar \"{{name}}\"?"
      },
      noteDetail: {
        title: "Detalles de la Escena",
        heading: "TÍTULO",
        description: "DESCRIPCIÓN",
        emotionalChange: "CAMBIO EMOCIONAL",
        conflict: "CONFLICTO",
        beatLink: "VINCULAR A HOJA DE TRAMA",
        placeholders: {
          heading: "(INT. o EXT) - LOCACIÓN - TIEMPO",
          description: "¿Qué sucede en la escena?",
          emotional: "¿Qué cambio emocional ocurrió?",
          conflict: "¿Cuál es el conflicto?"
        },
        unassigned: "-- Sin Asignar (Nota Libre) --"
      },
      tutorial: {
        steps: {
          toolbar: "Barra superior",
          toolbarDesc: "Gestiona proyectos, personajes y locaciones. Cambia de idioma o contraseña en tu menú de usuario.",
          beatSheet: "Hoja de beats",
          beatSheetDesc: "Describe tu historia paso a paso. Se guarda automáticamente al escribir.",
          board: "Tablero de tarjetas",
          boardDesc: "Haz clic en el fondo para crear tarjetas, arrástralas y haz doble clic para editar.",
          footer: "Comunidad",
          footerDesc: "Enlaces al código, contacto y contribuciones."
        },
        skip: "Omitir",
        prev: "Anterior",
        next: "Siguiente",
        done: "¡Entendido!"
      },
      footer: {
        by: "Por Simon Holmquist©",
        contribute: "Contribuir"
      }
    }
  },
  en: {
    translation: {
      toolbar: {
        projects: "Manage Projects",
        characters: "Characters",
        locations: "Locations",
        userMenu: {
          changePassword: "Change Password",
          logout: "Logout",
          deleteAccount: "Delete Account",
          confirmDelete: "Are you sure you want to delete your account? This cannot be undone.",
          accountDeleted: "Account successfully deleted."
        }
      },
      beatSheet: {
        title: "PROJECT TITLE:",
        logline: "LOGLINE:",
        genre: "GENRE:",
        date: "DATE:",
        desc_title: "The official name of your script.",
        desc_logline: "Your story summarized in one compelling sentence.",
        desc_genre: "The type of story and its rules (e.g., Monster in the House).",
        desc_date: "Last modification date.",
        beats: {
          openingImage: "1. Opening Image (1)",
          themeStated: "2. Theme Stated (5)",
          setUp: "3. Set-Up (1-10)",
          catalyst: "4. Catalyst (12)",
          debate: "5. Debate (12-25)",
          breakIntoTwo: "6. Break into Two (25)",
          bStory: "7. B Story (30)",
          funAndGames: "8. Fun and Games (30-35)",
          midpoint: "9. Midpoint (55)",
          badGuysCloseIn: "10. Bad Guys Close In (55-75)",
          allIsLost: "11. All Is Lost (75)",
          darkNightOfTheSoul: "12. Dark Night of the Soul (75-85)",
          breakIntoThree: "13. Break into Three (85)",
          finale: "14. Finale (85-110)",
          finalImage: "15. Final Image (110)"
        },
        beatDescriptions: {
          openingImage: "Sets the tone, style, and the 'before' snapshot of the hero.",
          themeStated: "Someone (not the hero) poses a question or statement that is the theme.",
          setUp: "Introduces the hero, their world (thesis), and what's missing in their life.",
          catalyst: "The life-changing event. There is no going back.",
          debate: "Should I stay or should I go? The hero doubts the journey.",
          breakIntoTwo: "The hero makes a choice and crosses the threshold into the upside-down world.",
          bStory: "The love story or friendship that carries the theme.",
          funAndGames: "The promise of the premise. Iconic scenes of the genre.",
          midpoint: "False victory or false defeat. Stakes are raised. The clock starts ticking.",
          badGuysCloseIn: "Internal and external forces of antagonism attack.",
          allIsLost: "Apparent defeat. Whiff of death. The hero loses what they thought they wanted.",
          darkNightOfTheSoul: "The hero wallows in misery, then finds the solution (the truth).",
          breakIntoThree: "The hero, having learned the theme, decides to fight. Synthesis.",
          finale: "The hero applies the lesson learned to defeat the bad guy and change the world.",
          finalImage: "The mirror of the opening image. Shows how much the hero has changed."
        }
      },
      board: {
        act1: "ACT I\n(pp. 1-25)",
        act2a: "ACT II\n(pp. 25-55)",
        act2b: "ACT II\n(pp. 55-85)",
        act3: "ACT III\n(pp. 85-110)",
        newScene: "NEW SCENE"
      },
      modals: {
        projects: "Manage Projects",
        characters: "Manage Characters",
        locations: "Manage Locations",
        add: "Add",
        save: "Save",
        cancel: "Cancel",
        close: "Close",
        delete: "Delete",
        edit: "Edit",
        select: "Select",
        confirmDeleteTitle: "Are you sure?",
        confirmDeleteMsg: "Are you sure you want to delete \"{{name}}\"?"
      },
      noteDetail: {
        title: "Scene Details",
        heading: "HEADING",
        description: "DESCRIPTION",
        emotionalChange: "EMOTIONAL CHANGE",
        conflict: "CONFLICT",
        beatLink: "LINK TO BEAT SHEET",
        placeholders: {
          heading: "(INT. or EXT) - LOCATION - TIME",
          description: "What happens in the scene?",
          emotional: "What emotional change occurred?",
          conflict: "What is the conflict?"
        },
        unassigned: "-- Unassigned (Free Note) --"
      },
      tutorial: {
        steps: {
          toolbar: "Top Bar",
          toolbarDesc: "Manage projects, characters, and locations. Change language or password in your user menu.",
          beatSheet: "Beat Sheet",
          beatSheetDesc: "Outline your story beat by beat. Auto-saves as you type.",
          board: "Corkboard",
          boardDesc: "Click background to create cards, drag to reorder, double-click to edit details.",
          footer: "Community",
          footerDesc: "Links to code, contact, and contributions."
        },
        skip: "Skip",
        prev: "Previous",
        next: "Next",
        done: "Got it!"
      },
      footer: {
        by: "By Simon Holmquist©",
        contribute: "Contribute"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto si falla la detección
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;