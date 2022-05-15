import { CProps } from 'src/common/types/client';
import { Box, Modal as MuiModal } from '@mui/material';
import { border } from 'src/common/styles';
import useMobileContext from 'src/common/context/MobileContext';

interface Props extends CProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  ...border,
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 2,
  bgcolor: 'background.paper',
};

function Modal({ open, onClose, children }: Props) {
  const { mobile } = useMobileContext();
  const responsive = mobile ? { width: '90%' } : null;

  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={[style, responsive]}>{children}</Box>
    </MuiModal>
  );
}

export default Modal;
