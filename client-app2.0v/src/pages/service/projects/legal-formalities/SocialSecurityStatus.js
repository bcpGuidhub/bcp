import { Container } from '@mui/material';
import { SocialSecurityHelper } from '../../../../components/services/guide/helper-tools';
import Page from '../../../../components/Page';
import { useSelector } from '../../../../redux/store';

export default function SocialSecurityStatus() {
  const { work } = useSelector((state) => state.project);
  const sector = work.activity_sector;
  return (
    <Page title="Social Security Status | Guidhub">
      <SocialSecurityHelper sector={sector} />
    </Page>
  );
}
