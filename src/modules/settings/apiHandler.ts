import { ApiHandlerWithConn } from 'src/common/types/server';
import { Float } from 'src/entities/Float';
import { success } from 'src/common/utils/response';
import { ApiError } from 'src/common/utils/server';
import { dbErrorText } from 'src/config/constants';

export const allFloats: ApiHandlerWithConn = async (req, res) => {
  const { db } = req;
  if (!db) throw new ApiError(dbErrorText);

  const repo = db.getRepository(Float);

  const result = await repo.find();
  success(res, result);
};

export const replaceFloat: ApiHandlerWithConn = async (req, res) => {
  const { db, body } = req;
  if (!db) throw new ApiError(dbErrorText);
  const { name, value } = body;

  const repo = db.getRepository(Float);

  const oldFloat = await repo.findOne({ where: { name } });

  const float = oldFloat ?? new Float();

  if (oldFloat === null) float.name = name;

  float.value = value;

  const result = await repo.save(float);
  success(res, result);
};
