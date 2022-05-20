import axios from 'axios';
import { FormValues } from 'src/common/components/Form';
import { Float } from 'src/entities/Float';

const route = '/api/settings';

export const getFloats = () => axios.get<Float[]>(`${route}/floats`);

export const putFloats = (float: FormValues) =>
  axios.put<Float>(`${route}/floats`, float);
