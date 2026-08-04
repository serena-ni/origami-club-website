import models from './models.json';

const imageModules = import.meta.glob('../../../images/origami/*.{webp,png,jpg,jpeg,svg}', {
  eager: true,
  import: 'default'
});

const imagesByFileName = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => [path.split('/').pop(), url])
);

const categoryFallbacks = {
  animal: 'foxes.webp',
  bird: 'butterfly.webp',
  'marine-life': 'turtles.webp',
  flower: 'lotus.webp',
  nature: 'clover.webp',
  dinosaur: 'bats.webp',
  mythical: 'bats.webp',
  food: 'hearts.webp',
  box: 'miura.webp',
  decoration: 'hearts.webp',
  modular: 'lucky stars.webp',
  holiday: 'christmas tree.webp',
  toy: 'bunny.webp',
  geometric: 'miura.webp',
  practical: 'miura.webp'
};

export const filterOptions = {
  difficulties: ['beginner', 'intermediate', 'advanced'],
  categories: [
    { value: 'animal', label: 'animal', matches: ['animal', 'bird', 'marine-life', 'dinosaur', 'mythical'] },
    { value: 'plant', label: 'plant', matches: ['nature', 'flower'] },
    { value: 'geometric', label: 'geometric', matches: ['geometric', 'modular'] },
    { value: 'practical', label: 'practical', matches: ['toy', 'practical', 'food', 'box', 'decoration', 'holiday'] }
  ],
  timeBuckets: [
    { value: 'under-10', label: 'under 10 min' },
    { value: '10-20', label: '10 - 20 min' },
    { value: '20-40', label: '20 - 40 min' },
    { value: '40-plus', label: '40+ min' }
  ]
};

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getTimeBucket(minutes) {
  if (minutes < 10) {
    return 'under-10';
  }

  if (minutes <= 20) {
    return '10-20';
  }

  if (minutes <= 40) {
    return '20-40';
  }

  return '40-plus';
}

function resolveThumbnail(thumbnail, category) {
  const fileName = String(thumbnail ?? '').split('/').pop();

  if (fileName && imagesByFileName[fileName]) {
    return imagesByFileName[fileName];
  }

  const fallbackFileName = categoryFallbacks[slugify(category)] ?? 'lotus.webp';
  return imagesByFileName[fallbackFileName] ?? Object.values(imagesByFileName)[0] ?? '';
}

function formatEstimatedTime(minutes) {
  if (minutes < 10) {
    return 'under 10 min';
  }

  if (minutes <= 20) {
    return '10 - 20 min';
  }

  if (minutes <= 40) {
    return '20 - 40 min';
  }

  return '40+ min';
}

export const origamiModels = models.map((model) => ({
  ...model,
  thumbnailUrl: resolveThumbnail(model.thumbnail, model.category),
  difficultySlug: slugify(model.difficulty),
  categorySlug: slugify(model.category),
  categoryGroupSlug: filterOptions.categories.find((group) => group.matches.includes(slugify(model.category)))?.value ?? 'creatures',
  timeBucket: getTimeBucket(model.estimatedTime),
  displayTime: formatEstimatedTime(model.estimatedTime),
  tagSlugs: (model.tags ?? []).map(slugify),
  relatedIds: model.related ?? []
}));

export function filterModels(modelsToFilter, filters) {
  return modelsToFilter.filter((model) => {
    const matchesDifficulty = !filters.difficulties.length || filters.difficulties.includes(model.difficultySlug);
    const matchesCategory = !filters.categories.length || filters.categories.includes(model.categoryGroupSlug);
    const matchesTime = !filters.timeBuckets.length || filters.timeBuckets.includes(model.timeBucket);

    return matchesDifficulty && matchesCategory && matchesTime;
  });
}

export function pickRandomModel(modelsToPickFrom) {
  if (!modelsToPickFrom.length) {
    return null;
  }

  return modelsToPickFrom[Math.floor(Math.random() * modelsToPickFrom.length)];
}

export function getRelatedModels(model, modelsToSearch, limit = 3) {
  if (!model) {
    return [];
  }

  const byId = new Map(modelsToSearch.map((item) => [item.id, item]));
  const related = [];
  const seen = new Set([model.id]);

  for (const relatedId of model.relatedIds) {
    const relatedModel = byId.get(relatedId);
    if (relatedModel && !seen.has(relatedModel.id)) {
      related.push(relatedModel);
      seen.add(relatedModel.id);
    }
  }

  if (related.length < limit) {
    const extras = modelsToSearch.filter((item) => {
      if (seen.has(item.id)) {
        return false;
      }

      return item.categorySlug === model.categorySlug || item.difficultySlug === model.difficultySlug;
    });

    for (const extra of extras) {
      if (related.length >= limit) {
        break;
      }

      related.push(extra);
      seen.add(extra.id);
    }
  }

  return related.slice(0, limit);
}

export function buildFilterState() {
  return {
    difficulties: [],
    categories: [],
    timeBuckets: []
  };
}

export function toggleInArray(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function getSelectedFilterLabel(total) {
  return total === 1 ? '1 model matches your filters' : `${total} models match your filters`;
}