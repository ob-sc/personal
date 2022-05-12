import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { getRandomInt } from 'utils/shared';

const words = [
  'Oh!',
  'Whoops!',
  'Hm...',
  ':/',
  ':(',
  'Öh...',
  'Oh Nein!',
  'Sorry',
  'Uff...',
];

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
        Dafür scheinen deine Berechtigungen nicht zu reichen. Ist das ein Fehler
        oder benötigst du diese? Dann{' '}
        <a href="mailto:personalabteilungœ@starcar.de">
          schreib uns eine Mail.
        </a>
      </Typography>
    </>
  );
}

export default NoAccess;

// todo mail klären simge, verwaltung von perso?
