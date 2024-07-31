import PropTypes from "prop-types";

//通用的ModalInput Component
export const ModalInput = ({
  label,
  value,
  name,
  onChange,
  readOnly = false,
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`${
        readOnly ? "bg-gray-200" : "border-blue-500"
      } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
    />
  </div>
);

ModalInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

//通用的DeleteModal Component
export const BaseDeleteModal = ({
  entity,
  entityName,
  onClose,
  onDelete,
  handleDelete,
}) => {
  const handleDeleteClick = () => {
    handleDelete(entity.uid, onDelete, onClose);
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Delete {entityName}</h2>
        <p className="mb-4">
          Are you sure you want to delete the &quot;{entity.name}&quot;?
        </p>
        <div className="flex justify-between">
          <button
            onClick={handleDeleteClick}
            className="bg-red-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-md font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

BaseDeleteModal.propTypes = {
  entity: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  entityName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
