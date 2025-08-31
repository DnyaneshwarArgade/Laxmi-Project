import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </div>
  );
}

export default Loading;