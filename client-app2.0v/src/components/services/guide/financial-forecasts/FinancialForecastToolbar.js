import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import eyeFill from '@iconify/icons-eva/eye-fill';

import closeFill from '@iconify/icons-eva/close-fill';
import messageSquareFill from '@iconify/icons-eva/message-square-fill';
import downloadFill from '@iconify/icons-eva/download-fill';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// material
import { Box, Tooltip, IconButton, DialogActions, Stack, Button, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
//
import { DialogAnimate } from '../../../animate';
import IncomeStatementPDF from './IncomeStatementPDF';
import BalanceSheetPDF from './BalanceSheetPDF';
import FinancialPlanPDF from './FinancialPlanPDF';
import TreasuryPDF from './TreasuryPDF';
import { Messenger } from '../../community';
// ----------------------------------------------------------------------

FinancialForecastToolbar.propTypes = {
  forecast: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};

export default function FinancialForecastToolbar({ forecast, user, document, type }) {
  const [openPDF, setOpenPDF] = useState(false);
  const [openEmbeddedMessenger, setOpenEmbeddedMessenger] = useState(false);

  const handleOpenPreview = () => {
    setOpenPDF(true);
  };

  const handleClosePreview = () => {
    setOpenPDF(false);
  };

  const handleOpenConfirm = () => {
    setOpenEmbeddedMessenger(true);
  };

  const handleCloseConfirm = () => {
    setOpenEmbeddedMessenger(false);
  };

  const getPdf = () => {
    switch (type) {
      case 'income-statement':
        return <IncomeStatementPDF forecast={forecast} user={user} document={document} />;
      case 'balance-sheet':
        return <BalanceSheetPDF forecast={forecast} user={user} document={document} />;
      case 'financial-plan':
        return <FinancialPlanPDF forecast={forecast} user={user} document={document} />;
      case 'treasury':
        return <TreasuryPDF forecast={forecast} user={user} document={document} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Stack mb={5} direction="row" justifyContent="flex-end" spacing={1.5}>
        {/* <Button
          color="primary"
          size="small"
          variant="contained"
          onClick={handleOpenConfirm}
          endIcon={<Icon icon={messageSquareFill} />}
        >
          hang out
        </Button> */}

        <Button
          color="info"
          size="small"
          variant="contained"
          onClick={handleOpenPreview}
          endIcon={<Icon icon={eyeFill} />}
          sx={{ mx: 1 }}
        >
          Prévisualiser
        </Button>

        <PDFDownloadLink document={getPdf()} style={{ textDecoration: 'none' }}>
          {({ loading }) => (
            <LoadingButton
              size="small"
              loading={loading}
              variant="contained"
              loadingPosition="end"
              endIcon={<Icon icon={downloadFill} />}
            >
              Télécharger
            </LoadingButton>
          )}
        </PDFDownloadLink>
      </Stack>

      <DialogAnimate fullScreen open={openPDF}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={handleClosePreview} sx={{ bgcolor: 'red' }}>
                <Icon icon={closeFill} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              {getPdf()}
            </PDFViewer>
          </Box>
        </Box>
      </DialogAnimate>

      {openEmbeddedMessenger && <Messenger embedded onClose={handleCloseConfirm} />}
    </>
  );
}
