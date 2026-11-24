import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Animal } from '../types';
import animalsData from '../data/animals.json';

interface AnimalsContextType {
  animals: Animal[];
  addAnimal: (animal: Omit<Animal, 'id'>) => void;
  removeAnimal: (id: number) => void;
  updateAnimal: (id: number, updates: Partial<Animal>) => void;
  getAnimalById: (id: number) => Animal | undefined;
}

const AnimalsContext = createContext<AnimalsContextType | undefined>(undefined);

const STORAGE_KEY = 'qurbanihaat_animals';

export const AnimalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [animals, setAnimals] = useState<Animal[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return animalsData as Animal[];
      }
    }
    return animalsData as Animal[];
  });

  // Persist to localStorage whenever animals change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
  }, [animals]);

  const addAnimal = useCallback((animal: Omit<Animal, 'id'>) => {
    setAnimals((prev) => {
      const maxId = prev.reduce((max, a) => Math.max(max, a.id), 0);
      const newAnimal: Animal = {
        ...animal,
        id: maxId + 1,
      };
      return [...prev, newAnimal];
    });
  }, []);

  const removeAnimal = useCallback((id: number) => {
    setAnimals((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAnimal = useCallback((id: number, updates: Partial<Animal>) => {
    setAnimals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const getAnimalById = useCallback(
    (id: number) => animals.find((a) => a.id === id),
    [animals]
  );

  return (
    <AnimalsContext.Provider
      value={{ animals, addAnimal, removeAnimal, updateAnimal, getAnimalById }}
    >
      {children}
    </AnimalsContext.Provider>
  );
};

export const useAnimals = () => {
  const context = useContext(AnimalsContext);
  if (!context) {
    throw new Error('useAnimals must be used within an AnimalsProvider');
  }
  return context;
};
