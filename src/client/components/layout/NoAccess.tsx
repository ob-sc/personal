import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { getRandomInt } from '../../../utils/shared';

const words = ['Oh!', 'Whoops!', 'Hm...', ':/', ':(', 'Öh...', 'Oh Nein!'];

function NoAccess() {
  const [word, setWord] = useState('');

  useEffect(() => {
    setWord(words[getRandomInt(words.length)]);
  }, []);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {word}
      </Typography>
      <Typography>
        Du scheinst keine Station und keine Berechtigungen zu haben. Ist das ein
        Fehler? Schreib uns unter{' '}
        <a href="mailto:edv@starcar.de">edv@starcar.de</a>
      </Typography>
    </>
  );
}

export default NoAccess;
