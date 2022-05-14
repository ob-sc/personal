import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Region } from 'entities/Region';
import {
  deleteRegion,
  getRegion,
  postRegion,
  useGetRegions,
} from 'client/api/regions';
import Chip from 'client/components/common/Chip';
import Modal from 'client/components/common/Modal';
import Form from 'client/components/common/Form';
import DataList from 'client/components/common/DataList';

function RegionsContainer() {
  const regions = useGetRegions();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const regionUsers =
    selectedRegion && selectedRegion.users.length > 0
      ? selectedRegion.users
          .map((user) => `${user.first_name} ${user.last_name}`)
          .join(', ')
      : 'Keine';

  const regionStations =
    selectedRegion && selectedRegion.stations.length > 0
      ? selectedRegion.stations.map((station) => station.name).join(', ')
      : 'Keine';

  const regionSubStations =
    selectedRegion && selectedRegion.subStations.length > 0
      ? selectedRegion.subStations.map((station) => station.name).join(', ')
      : 'Keine';

  const regionData = [
    // { label: 'ID', value: String(selectedRegion?.id) },
    { label: 'Benutzer', value: regionUsers },
    { label: 'Region 1', value: regionStations },
    { label: 'Region 2', value: regionSubStations },
  ];

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
              setSelectedRegion(
                r.data.id === selectedRegion?.id ? null : r?.data
              );
            }}
            onDelete={async () => {
              await deleteRegion(region.id);
              await regions.mutate();
              if (selectedRegion?.id === region.id) {
                setSelectedRegion(null);
              }
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
            <DataList data={regionData ?? []} />
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
          onSubmit={async (values) => {
            await postRegion(values);
            await regions.mutate();
            setModalOpen(false);
          }}
          size="full"
        />
      </Modal>
    </>
  );
}

export default RegionsContainer;
