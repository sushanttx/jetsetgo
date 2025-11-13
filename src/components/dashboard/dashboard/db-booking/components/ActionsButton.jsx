const ActionsButton = ({ onView, onCancel }) => {
  const handleView = () => {
    onView && onView();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <div className="d-flex items-center" style={{ gap: '8px' }}>
      <button
        className="text-white text-12 fw-500 hover:opacity-80 transition-all border-0 cursor-pointer"
        onClick={handleView}
        title="View Details"
        style={{
          backgroundColor: '#377dff',
          padding: '6px 12px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          minWidth: '60px',
          height: '28px'
        }}
      >
        <i className="icon icon-eye text-12" />
        <span>View</span>
      </button>
      <button
        className="text-white text-12 fw-500 hover:opacity-80 transition-all border-0 cursor-pointer"
        onClick={handleCancel}
        title="Cancel Booking"
        style={{
          backgroundColor: '#ff4757',
          padding: '6px 12px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          minWidth: '70px',
          height: '28px'
        }}
      >
        <i className="icon icon-close text-12" />
        <span>Cancel</span>
      </button>
    </div>
  );
};

export default ActionsButton;
