import type { Question } from '../domain/types.js';

export const demoQuestions: readonly Question[] = [
  {
    id: 'historia-ww2-001', subject: 'historia', topic: 'Segunda Guerra Mundial', difficulty: 'Intermedio',
    prompt: '¿Qué hecho se considera el inicio de la Segunda Guerra Mundial en Europa?',
    answers: ['Ataque a Pearl Harbor', 'Invasión de Polonia', 'Caída de Francia', 'Batalla de Stalingrado'],
    correctAnswer: 1,
    explanation: 'Alemania invadió Polonia el 1 de septiembre de 1939.'
  },
  {
    id: 'fisica-mov-001', subject: 'fisica', topic: 'Movimiento y fuerzas', difficulty: 'Intermedio',
    prompt: 'Si un móvil recorre distancias iguales en tiempos iguales, su movimiento es…',
    answers: ['MRU', 'MUA', 'Circular acelerado', 'Armónico'],
    correctAnswer: 0,
    explanation: 'En MRU la velocidad permanece constante.'
  },
  {
    id: 'biologia-gen-001', subject: 'biologia', topic: 'Genética y célula', difficulty: 'Intermedio',
    prompt: '¿Qué molécula almacena la información genética hereditaria?',
    answers: ['ATP', 'ADN', 'Glucosa', 'Colesterol'],
    correctAnswer: 1,
    explanation: 'El ADN almacena la información genética de los organismos celulares.'
  },
  {
    id: 'matematicas-func-001', subject: 'matematicas', topic: 'Funciones y álgebra', difficulty: 'Intermedio',
    prompt: 'Si f(x)=2x+3, ¿cuánto vale f(4)?',
    answers: ['8', '10', '11', '14'],
    correctAnswer: 2,
    explanation: 'f(4)=2(4)+3=11.'
  }
] as const;
