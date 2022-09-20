import { Box, Typography } from '@mui/material';
import { FormField } from 'src/common/types/client';
import Form, { FormValues } from 'src/common/components/Form';
import { border } from 'src/common/styles';
import { Crent } from 'src/entities/Crent';
import { putCrent } from 'src/modules/users/api';

interface Props {
  userId: number;
  crent: Crent | null | undefined;
}

function CrentForm({ userId, crent }: Props) {
  const { username, personell_id, register_id } = crent ?? {};

  const fields: FormField[] = [
    { name: 'username', label: 'Benutzer', type: 'text', required: true },
    {
      name: 'personell_id',
      label: 'Personalnummer',
      type: 'number',
      required: true,
    },
    { name: 'register_id', label: 'Kassenkonto', type: 'number' },
  ];

  const handleSubmit = async (values: FormValues) => {
    await putCrent(userId, {
      username: values.username,
      personell_id: Number(values.personell_id),
      register_id: values.register_id ? Number(values.register_id) : null,
    });
  };

  return (
    <>
      <Typography variant="h2">C-Rent</Typography>
      <Box sx={{ ...border, p: 1 }}>
        <Form
          inline
          cols={3}
          size="md"
          onSubmit={handleSubmit}
          fields={fields}
          submitName="Speichern"
          values={
            crent
              ? {
                  username: username ?? '',
                  personell_id: String(personell_id),
                  register_id: register_id ? String(register_id) : '',
                }
              : undefined
          }
        />
      </Box>
    </>
  );
}

export default CrentForm;
