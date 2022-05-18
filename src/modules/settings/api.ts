import axios from 'axios';
import { Float } from 'src/entities/Float';

const route = '/api/settings';

export const getFloats = () => axios.get<Float[]>(`${route}/floats`);
