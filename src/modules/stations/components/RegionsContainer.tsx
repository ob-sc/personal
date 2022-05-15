import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Region } from 'src/entities/Region';
import {
  deleteRegion,
  getRegion,
  postRegion,
  useGetRegions,
} from 'src/modules/regions/api';
import Chip from 'src/common/components/Chip';
import Modal from 'src/common/components/Modal';
import Form from 'src/common/components/Form';
import DataList from 'src/common/components/DataList';
import { commaJoin } from 'src/common/utils/shared';

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
        <Box mb={1}>
          {regions?.data?.map((region) => (
            <Chip
              label={region.name}
              onClick={async () => {
                setDeleteError(false);
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
        </Box>

        {deleteError ? (
          <Typography color="error">
            Fehler beim löschen, eventuell sind noch Stationen in der Region
          </Typography>
        ) : null}
        {!selectedRegion ? null : <DataList data={regionData ?? []} />}
      </Box>

      {/* fields und submitHandler inlinen ist hier unschön aber leichter mit den types */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Form
          fields={[
            { label: 'Name', name: 'name', type: 'text', required: true },
          ]}
          onSubmit={async (values) => {
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

// todo wenn noch stationen / user in der region und löschen nicht geht, dann entfernen und löschen? cascade?
