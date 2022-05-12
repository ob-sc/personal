import { ApiRequestHandler } from 'types/server';
import { incompleteRequestText } from 'config/constants';
import { Region } from 'entities/Region';
import { success } from 'server/response';
import { idFromQuery } from 'utils/server';

type RegionHandler = ApiRequestHandler<Region>;

export const allRegions: RegionHandler = async (res, repo) => {
  const result = await repo.find();
  success(res, result);
};

export const singleRegion: RegionHandler = async (res, repo, data) => {
  if (!data || !data.query) throw new Error(incompleteRequestText);

  const id = idFromQuery(data.query.id);

  const region = await repo.findOne({
    where: {
      id,
    },
    relations: { users: true, stations: true, subStations: true },
  });

  if (region === null) throw new Error('Region nicht gefunden');

  success(res, region);
};

export const createRegion: RegionHandler = async (res, repo, data) => {
  if (!data || !data.body) throw new Error(incompleteRequestText);

  const region = new Region();
  region.name = data.body.name;
  const result = await repo.save(region);
  success(res, result);
};

export const removeRegion: RegionHandler = async (res, repo, data) => {
  if (!data || !data.query) throw new Error(incompleteRequestText);

  const id = idFromQuery(data.query.id);

  const result = await repo.findOne({
    where: { id },
  });

  if (result === null) throw new Error('Region nicht gefunden');

  await repo.remove(result);
  success(res, 'Region gelöscht');
};
