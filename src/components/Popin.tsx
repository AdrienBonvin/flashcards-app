interface PopinProps {
  onClose?: () => void;
  children: React.ReactNode;
}

const Popin: React.FC<PopinProps> = ({ onClose, children }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10">
      <div className="items-center bg-background border border-highlight w-10/12 h-[80vh] rounded-lg p-4 flex flex-col gap-4 overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popin;
