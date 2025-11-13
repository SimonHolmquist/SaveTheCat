import { createContext, useContext } from 'react';
import type { Character, Location } from '../types/entities';

// Definimos el tipo de datos que tendrá el contexto
type EntityContextType = {
    characters: readonly Character[];
    locations: readonly Location[];
};

// Creamos el contexto con un valor por defecto
const EntityContext = createContext<EntityContextType>({
    characters: [],
    locations: [],
});

// Creamos el Proveedor del contexto para usar en App.tsx
export const EntityProvider = EntityContext.Provider;

// Creamos un hook personalizado para consumir fácilmente el contexto
export const useEntitiesContext = () => {
    const context = useContext(EntityContext);
    if (context === undefined) {
        throw new Error('useEntitiesContext debe ser usado dentro de un EntityProvider');
    }
    return context;
};