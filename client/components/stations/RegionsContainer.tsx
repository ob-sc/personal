import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import {
  deleteRegion,
  getRegion,
  postRegion,
  useGetRegions,
} from 'client/api/regions';
import Chip from 'client/components/common/Chip';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'client/components/common/Modal';
import Form from 'client/components/common/Form';
import { Region } from 'entities/Region';

const tableCellCrop = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  // width: '100%',
};

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

            <table>
              <tr>
                <td>ID</td>
                <td>{selectedRegion.id}</td>
              </tr>
              <tr>
                <td>Benutzer</td>
                <td>
                  <Box sx={tableCellCrop}>
                    {selectedRegion.users.length > 0
                      ? selectedRegion.users
                          .map((user) => `${user.first_name} ${user.last_name}`)
                          .join(', ')
                      : 'Keine'}
                  </Box>
                </td>
              </tr>
              <tr>
                <td>Region 1</td>
                <td>
                  <Box sx={tableCellCrop}>
                    {selectedRegion.stations.length > 0
                      ? selectedRegion.stations
                          .map((station) => station.name)
                          .join(', ')
                      : 'Keine'}
                  </Box>
                </td>
              </tr>
              <tr>
                <td>Region 2</td>
                <td>
                  <Box sx={tableCellCrop}>
                    {selectedRegion.subStations.length > 0
                      ? selectedRegion.subStations
                          .map((station) => station.name)
                          .join(', ')
                      : 'Keine'}
                  </Box>
                </td>
              </tr>
            </table>
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
        />
      </Modal>
    </>
  );
}

export default RegionsContainer;

// todo text overflow in tabelle testen (am besten west 1, regionen und benutzer)
