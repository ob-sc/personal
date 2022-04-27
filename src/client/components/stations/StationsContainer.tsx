import { ParsedUser } from '../../../../types/server';
import { Station } from '../../../entities/Station';

interface Props {
  stations: Station[];
  user: ParsedUser;
}

function StationsContainer({ stations, user }: Props) {
  return (
    <>
      {stations.map((station) => (
        <div key={station.name}>
          <div>{station.name}</div>
        </div>
      ))}
    </>
  );
}

export default StationsContainer;
