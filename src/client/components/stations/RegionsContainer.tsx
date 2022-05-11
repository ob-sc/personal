import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
  deleteRegion,
  getRegion,
  postRegion,
  useGetRegions,
} from 'src/client/api/regions';
import Chip from 'src/client/components/common/Chip';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'src/client/components/common/Modal';
import Form from 'src/client/components/common/Form';
import { Region } from 'src/entities/Region';

function RegionsContainer() {
  const regions = useGetRegions();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  return (
    <>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="h5" gutterBottom>
          Regionen
        </Typography>
        {regions?.data?.map((region) => (
          <Chip
            label={region.name}
            onClick={async () => {
              const r = await getRegion(region.id);
              setSelectedRegion(r?.data);
            }}
            onDelete={async () => {
              await deleteRegion(region.id);
              await regions.mutate();
            }}
            key={`region-${region.id}`}
          />
        ))}
        <IconButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <AddIcon />
        </IconButton>

        {!selectedRegion ? null : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{selectedRegion.name}</Typography>

            <Typography>ID: {selectedRegion.id}</Typography>

            <Typography>
              Benutzer:{' '}
              {selectedRegion.users.length > 0
                ? selectedRegion.users
                    .map((user) => `${user.first_name} ${user.last_name}`)
                    .join(', ')
                : 'Keine'}
            </Typography>

            <Typography>
              Stationen:{' '}
              {selectedRegion.stations.length > 0
                ? selectedRegion.stations
                    .map((station) => station.name)
                    .join(', ')
                : 'Keine'}
            </Typography>

            <Typography>
              Stationen mit Region 2:{' '}
              {selectedRegion.subStations.length > 0
                ? selectedRegion.subStations
                    .map((station) => station.name)
                    .join(', ')
                : 'Keine'}
            </Typography>
          </Box>
        )}
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Form
          fields={[
            {
              label: 'Name',
              name: 'name',
              type: 'text',
              required: true,
            },
          ]}
          submitHandler={async (values) => {
            await postRegion(values);
            await regions.mutate();
            setModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

export default RegionsContainer;
