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
