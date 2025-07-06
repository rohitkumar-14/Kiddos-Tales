const Loader = () => (
    <div style={loaderStyles}>
      <div className="spinner"></div>
    </div>
  );
export default Loader  
  const loaderStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999
  };
  