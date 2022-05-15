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
import { commaJoin } from 'utils/shared';

function RegionsContainer() {
  const regions = useGetRegions();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [deleteError, setDeleteError] = useState(false);

  const mappedUsers =
    selectedRegion?.users.map((v) => `${v.first_name} ${v.last_name}`) ?? [];

  const mappedRegion = selectedRegion?.stations.map((v) => v.name) ?? [];

  const mappedSub = selectedRegion?.substations.map((v) => v.name) ?? [];

  const regionData = [
    // { label: 'ID', value: String(selectedRegion?.id) },
    { key: 'Benutzer', value: commaJoin(mappedUsers) },
    { key: 'Region 1', value: commaJoin(mappedRegion) },
    { key: 'Region 2', value: commaJoin(mappedSub) },
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
              try {
                setDeleteError(false);
                await deleteRegion(region.id);
                await regions.mutate();
                if (selectedRegion?.id === region.id) {
                  setSelectedRegion(null);
                }
              } catch (err) {
                setDeleteError(true);
              }
            }}
            key={`region-${region.id}`}
            selected={selectedRegion?.id === region.id}
          />
        ))}
        <IconButton
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <AddIcon />
        </IconButton>
        {deleteError ? (
          <Typography color="error">
            Fehler beim löschen, eventuell sind noch Stationen in der Region
          </Typography>
        ) : null}
        {!selectedRegion ? null : <DataList data={regionData ?? []} />}
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
