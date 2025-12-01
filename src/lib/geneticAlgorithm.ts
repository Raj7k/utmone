/**
 * Genetic Algorithm Implementation
 * From "Algorithms for Optimization" Chapter 9
 * 
 * Evolves high-converting UTM parameter patterns
 */

export interface GeneticAlgorithmOptions {
  populationSize?: number;
  generations?: number;
  mutationRate?: number;
  crossoverRate?: number;
  elitismCount?: number;
  tournamentSize?: number;
}

export interface Individual<T> {
  chromosome: T;
  fitness: number;
}

export interface EvolutionResult<T> {
  bestIndividual: Individual<T>;
  population: Individual<T>[];
  generation: number;
  averageFitness: number;
}

/**
 * Genetic Algorithm for optimization
 */
export function geneticAlgorithm<T>(
  initialPopulation: T[],
  fitnessFunction: (chromosome: T) => number,
  crossoverFunction: (parent1: T, parent2: T) => T,
  mutationFunction: (chromosome: T) => T,
  options: GeneticAlgorithmOptions = {}
): EvolutionResult<T> {
  const {
    populationSize = 50,
    generations = 100,
    mutationRate = 0.1,
    crossoverRate = 0.8,
    elitismCount = 2,
    tournamentSize = 3
  } = options;

  // Initialize population
  let population: Individual<T>[] = initialPopulation.map(chromosome => ({
    chromosome,
    fitness: fitnessFunction(chromosome)
  }));

  // Ensure population size
  while (population.length < populationSize) {
    const randomChromosome = population[Math.floor(Math.random() * population.length)].chromosome;
    population.push({
      chromosome: mutationFunction(randomChromosome),
      fitness: fitnessFunction(randomChromosome)
    });
  }

  for (let gen = 0; gen < generations; gen++) {
    // Sort by fitness (descending - higher is better)
    population.sort((a, b) => b.fitness - a.fitness);

    // Create next generation
    const nextGeneration: Individual<T>[] = [];

    // Elitism: Keep best individuals
    for (let i = 0; i < elitismCount && i < population.length; i++) {
      nextGeneration.push({ ...population[i] });
    }

    // Generate offspring
    while (nextGeneration.length < populationSize) {
      // Tournament selection for parents
      const parent1 = tournamentSelection(population, tournamentSize);
      const parent2 = tournamentSelection(population, tournamentSize);

      // Crossover
      let offspring: T;
      if (Math.random() < crossoverRate) {
        offspring = crossoverFunction(parent1.chromosome, parent2.chromosome);
      } else {
        offspring = parent1.chromosome;
      }

      // Mutation
      if (Math.random() < mutationRate) {
        offspring = mutationFunction(offspring);
      }

      nextGeneration.push({
        chromosome: offspring,
        fitness: fitnessFunction(offspring)
      });
    }

    population = nextGeneration;
  }

  // Final sort
  population.sort((a, b) => b.fitness - a.fitness);

  const averageFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;

  return {
    bestIndividual: population[0],
    population,
    generation: generations,
    averageFitness
  };
}

/**
 * Tournament selection: Select best from random subset
 */
function tournamentSelection<T>(
  population: Individual<T>[],
  tournamentSize: number
): Individual<T> {
  let best = population[Math.floor(Math.random() * population.length)];

  for (let i = 1; i < tournamentSize; i++) {
    const competitor = population[Math.floor(Math.random() * population.length)];
    if (competitor.fitness > best.fitness) {
      best = competitor;
    }
  }

  return best;
}

/**
 * UTM Parameter Chromosome
 */
export interface UTMChromosome {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

/**
 * Crossover for UTM parameters (single-point)
 */
export function utmCrossover(parent1: UTMChromosome, parent2: UTMChromosome): UTMChromosome {
  const keys: (keyof UTMChromosome)[] = ['source', 'medium', 'campaign', 'term', 'content'];
  const crossoverPoint = Math.floor(Math.random() * keys.length);

  const offspring: UTMChromosome = { source: '', medium: '', campaign: '' };

  keys.forEach((key, index) => {
    if (index < crossoverPoint) {
      offspring[key] = parent1[key] || '';
    } else {
      offspring[key] = parent2[key] || '';
    }
  });

  return offspring;
}

/**
 * Mutation for UTM parameters
 */
export function utmMutation(chromosome: UTMChromosome, vocabulary: string[][]): UTMChromosome {
  const mutated = { ...chromosome };
  const keys: (keyof UTMChromosome)[] = ['source', 'medium', 'campaign', 'term', 'content'];
  const mutateKey = keys[Math.floor(Math.random() * keys.length)];

  // Replace with random word from vocabulary
  const vocabIndex = keys.indexOf(mutateKey);
  if (vocabulary[vocabIndex] && vocabulary[vocabIndex].length > 0) {
    const randomWord = vocabulary[vocabIndex][Math.floor(Math.random() * vocabulary[vocabIndex].length)];
    mutated[mutateKey] = randomWord;
  }

  return mutated;
}

/**
 * Generate initial UTM population from historical data
 */
export function generateUTMPopulation(historicalUTMs: UTMChromosome[], size: number): UTMChromosome[] {
  const population: UTMChromosome[] = [...historicalUTMs];

  // Fill remaining with variations
  while (population.length < size) {
    const base = historicalUTMs[Math.floor(Math.random() * historicalUTMs.length)];
    population.push({ ...base });
  }

  return population.slice(0, size);
}
